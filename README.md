# Keln provider for OpenClaw

Use [Keln](https://keln.ai) models in [OpenClaw](https://github.com/openclaw/openclaw) as a
first-class provider.

Keln is an inference platform for open models with an OpenAI-compatible API. Keln maintains this
plugin. It is not affiliated with OpenClaw.

## Install

```sh
openclaw plugins install clawhub:@kris-holy/openclaw-keln-provider
```

## Configure

1. Sign up at [app.keln.ai](https://app.keln.ai/signup). Open **Keys** → **Create key** and copy
   the key.
2. Save the key in OpenClaw:

   ```sh
   openclaw models auth paste-api-key --provider keln
   ```

3. Pick a model, for example `keln/zai-org/glm-5.3`.

## Models

OpenClaw reads the live catalog from `https://api.keln.ai/v1/models`, including prices, context
windows and input types. If that request fails, the picker shows these models with tool calling.
Prices show as 0 in this list until the live catalog loads.

| Model | Input |
|---|---|
| `zai-org/glm-5.3` | text |
| `zai-org/glm-5.3-flash` | text, images |
| `moonshotai/kimi-k3` | text, images |
| `qwen/qwen3.8-2.4t-a95b` | text |
| `deepseek-ai/deepseek-v4.1-flash` | text, images |

Decision models such as `cloudflare/clef` and `typesafe/jev-1.14` answer typed questions through
`/v1/decisions` and do not write text, so the plugin leaves them out.

The plugin requests up to 32,768 output tokens per response, covering reasoning and answer together.
Keln checks that the prompt plus this cap fit the model's context window.

Prices are on [Models & pricing](https://docs.keln.ai/models-pricing/).

## Security and footprint

- **Network:** OpenClaw sends your requests, including prompts and any files or images in them, to
  `https://api.keln.ai` using your Keln key, and reads the model list from the same host. See
  [Privacy & zero data retention](https://docs.keln.ai/capabilities/privacy/).
- **Code:** the plugin registers 1 model provider. It adds no tools or hooks, runs no shell commands
  or background processes, reads no files, and has no runtime dependencies besides OpenClaw.
- **Credentials:** OpenClaw holds the key.
- **Telemetry:** the plugin sends no telemetry.

## Compatibility

Requires OpenClaw `>=2026.11.1`, which runs on Node 24.16 or newer.

## License

MIT
