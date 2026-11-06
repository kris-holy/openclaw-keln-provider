// The openclaw npm package ships these SDK entry points without type declarations.
// These cover only what this plugin uses.

declare module "openclaw/plugin-sdk/provider-model-shared" {
  export type ModelDefinitionConfig = {
    id: string;
    name: string;
    reasoning: boolean;
    input: Array<"text" | "image">;
    contextWindow: number;
    maxTokens: number;
    cost: { input: number; output: number; cacheRead: number; cacheWrite: number };
    compat?: { supportsUsageInStreaming?: boolean };
  };
  export type ModelProviderConfig = {
    baseUrl: string;
    api: string;
    models: ModelDefinitionConfig[];
  };
}

declare module "openclaw/plugin-sdk/provider-catalog-live-runtime" {
  import type {
    ModelDefinitionConfig,
    ModelProviderConfig,
  } from "openclaw/plugin-sdk/provider-model-shared";
  export type OpenAICompatibleModelDiscoveryOptions = {
    projectRows: (rows: unknown[], fallback: ModelProviderConfig) => ModelDefinitionConfig[];
  };
}

declare module "openclaw/plugin-sdk/provider-catalog-shared" {
  import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
  export function buildManifestModelProviderConfig(params: {
    providerId: string;
    catalog: unknown;
  }): ModelProviderConfig;
  export function readManifestProviderDefaultModelRef(
    manifest: unknown,
    providerId: string,
  ): string | undefined;
}

declare module "openclaw/plugin-sdk/provider-onboard" {
  export function createProviderConnectionPresetAppliers<T extends unknown[]>(
    options: unknown,
  ): { applyConfig: (...args: any[]) => any };
}

declare module "openclaw/plugin-sdk/provider-entry" {
  export function defineSingleProviderPluginEntry(options: unknown): unknown;
}
