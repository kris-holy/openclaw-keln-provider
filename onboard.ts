import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createProviderConnectionPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
import manifest from "./openclaw.plugin.json" with { type: "json" };
import { buildKelnCatalogModels, KELN_BASE_URL } from "./provider-catalog.js";

export const KELN_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(manifest, "keln")!;

export const { applyConfig: applyKelnConfig } = createProviderConnectionPresetAppliers<[]>({
  primaryModelRef: KELN_DEFAULT_MODEL_REF,
  resolveParams: () => ({
    providerId: "keln",
    api: "openai-completions",
    baseUrl: KELN_BASE_URL,
    catalogModels: buildKelnCatalogModels,
    aliases: [{ modelRef: KELN_DEFAULT_MODEL_REF, alias: "Keln GLM 5.3" }],
  }),
});
