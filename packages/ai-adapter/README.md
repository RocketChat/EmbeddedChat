# @embeddedchat/ai-adapter

Provider-agnostic AI adapter for EmbeddedChat. Switch between AI backends with **one config value** — zero changes to widget code.

## Quick Start

```ts
import { AdapterFactory } from '@embeddedchat/ai-adapter';

// Works immediately — no API key needed
const adapter = AdapterFactory.create({ provider: 'mock' });

// Upgrade to OpenAI with a single line change
const adapter = AdapterFactory.create({
  provider: 'openai',
  openaiApiKey: process.env.OPENAI_API_KEY,
});
```

## Interface Contract

Every adapter implements `AIAdapter`:

```ts
interface AIAdapter {
  readonly providerName: string;

  // Suggest 3 contextual replies based on recent messages
  getSmartReplies(context: SmartReplyContext): Promise<SmartReplySuggestion[]>;

  // Summarize a thread into 2–3 sentences
  summarizeThread(messages: ChatMessage[]): Promise<string>;

  // Classify and optionally enhance a message before sending
  processMessage(message: string): Promise<ProcessedMessage>;
}
```

## Built-in Providers

| Key | Description | API Key |
|-----|-------------|---------|
| `mock` | Context-aware responses, zero setup | None |
| `openai` | GPT-4o-mini, production quality | `OPENAI_API_KEY` |
| `rocketchat` | RC server AI (stub, ready to wire) | RC token |

## Write a Custom Adapter in Under 20 Lines

```ts
import { AIAdapter, SmartReplyContext, SmartReplySuggestion,
         ChatMessage, ProcessedMessage, AdapterFactory } from '@embeddedchat/ai-adapter';

class GeminiAdapter implements AIAdapter {
  readonly providerName = 'Google Gemini';

  async getSmartReplies(ctx: SmartReplyContext): Promise<SmartReplySuggestion[]> {
    const reply = await callGemini(ctx.recentMessages);       // your API call
    return [{ id: '0', text: reply, confidence: 0.9 }];
  }

  async summarizeThread(msgs: ChatMessage[]): Promise<string> {
    return callGemini(msgs.map(m => m.msg).join('\n'));
  }

  async processMessage(msg: string): Promise<ProcessedMessage> {
    return { original: msg, enhanced: msg, category: 'other', sentiment: 'neutral' };
  }
}

// Register once, use everywhere
AdapterFactory.register('gemini', GeminiAdapter as any);
const adapter = AdapterFactory.create({ provider: 'gemini' as any });
```

## Plugging into EmbeddedChat

```jsx
import { AdapterFactory } from '@embeddedchat/ai-adapter';
import { AIAdapterProvider } from '@embeddedchat/react';

const adapter = AdapterFactory.create({ provider: 'mock' });

<AIAdapterProvider adapter={adapter}>
  <EmbeddedChat host="..." roomId="..." />
</AIAdapterProvider>
```

## Fallback Behaviour

If `create()` throws (e.g. missing API key), it automatically falls back to `MockAIAdapter` and logs a warning — the widget **always works**.

## Env Vars

| Variable | Used by |
|----------|---------|
| `OPENAI_API_KEY` | OpenAIAdapter |
| `VITE_OPENAI_API_KEY` | OpenAIAdapter (Vite apps) |
