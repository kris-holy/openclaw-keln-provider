import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { applyKelnConfig } from "./onboard.js";
import manifest from "./openclaw.plugin.json" with { type: "json" };
import { KELN_MODEL_DISCOVERY } from "./provider-catalog.js";

export default defineSingleProviderPluginEntry({
  id: "keln",
  name: "Keln",
  description: "Keln model provider: open models through an OpenAI-compatible API.",
  manifest,
  provider: {
    label: "Keln",
    docsPath: "https://docs.keln.ai/quickstart/",
    manifestAuth: {
      preserveExistingPrimary: true,
      applyConfig: applyKelnConfig,
      noteMessage: [
        "Keln serves open models through an OpenAI-compatible API.",
        "Get your API key at: https://app.keln.ai/signup",
      ].join("\n"),
      noteTitle: "Keln",
    },
    catalog: {
      discoveryMode: "strict",
      allowExplicitBaseUrl: true,
      liveModelDiscovery: KELN_MODEL_DISCOVERY,
    },
  },
});
