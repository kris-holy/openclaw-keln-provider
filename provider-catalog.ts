import type { OpenAICompatibleModelDiscoveryOptions } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import type {
  ModelDefinitionConfig,
  ModelProviderConfig,
} from "openclaw/plugin-sdk/provider-model-shared";
import manifest from "./openclaw.plugin.json" with { type: "json" };

export const KELN_BASE_URL = manifest.modelCatalog.providers.keln.baseUrl;

// The Keln catalog publishes no output cap, so the plugin requests up to this much per response.
// The cap covers reasoning and answer together.
const DEFAULT_MAX_TOKENS = 32768;

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function perMillion(value: unknown): number {
  const perToken = Number(value);
  return Number.isFinite(perToken) && perToken > 0 ? Math.round(perToken * 1e12) / 1e6 : 0;
}

function projectRow(row: unknown, seeds: Map<string, ModelDefinitionConfig>) {
  const record = asRecord(row);
  const id = typeof record?.id === "string" ? record.id.trim() : "";
  const contextWindow = Number(record?.context_length);
  const outputs = record?.output_modalities;
  // Decision models output typed answers, so they can't run as chat models.
  if (!id || !Array.isArray(outputs) || !outputs.includes("text")) return undefined;
  if (!Number.isSafeInteger(contextWindow) || contextWindow <= 0) return undefined;

  const inputs = record?.input_modalities;
  const pricing = asRecord(record?.pricing);
  const efforts = asRecord(record?.reasoning)?.supported_efforts;
  const seed = seeds.get(id);
  // Prices and limits come from the live catalog. The seed only supplies a display name.
  const model: ModelDefinitionConfig = {
    ...seed,
    id,
    name: seed?.name ?? id,
    reasoning: Array.isArray(efforts) && efforts.length > 0,
    input: Array.isArray(inputs) && inputs.includes("image") ? ["text", "image"] : ["text"],
    contextWindow,
    maxTokens: Math.min(contextWindow, DEFAULT_MAX_TOKENS),
    cost: {
      input: perMillion(pricing?.prompt),
      output: perMillion(pricing?.completion),
      cacheRead: perMillion(pricing?.input_cache_read),
      cacheWrite: 0,
    },
    compat: { supportsUsageInStreaming: true },
  };
  return model;
}

export const KELN_MODEL_DISCOVERY: OpenAICompatibleModelDiscoveryOptions = {
  projectRows(rows, fallback) {
    const seeds = new Map(fallback.models.map((model) => [model.id, model]));
    return rows.flatMap((row) => {
      const model = projectRow(row, seeds);
      return model ? [model] : [];
    });
  },
};

export function buildKelnProvider(): ModelProviderConfig {
  return buildManifestModelProviderConfig({
    providerId: "keln",
    catalog: manifest.modelCatalog.providers.keln,
  });
}

export function buildKelnCatalogModels(): ModelDefinitionConfig[] {
  return buildKelnProvider().models;
}
