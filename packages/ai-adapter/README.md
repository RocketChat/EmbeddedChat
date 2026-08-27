# @embeddedchat/ai-adapter

Pluggable AI adapter layer for [EmbeddedChat](https://github.com/RocketChat/EmbeddedChat). Connect any local or cloud AI provider to add smart widget features — reply suggestions, context-aware prompts, and more.

## Architecture

```
Host App
├── Config
└── AI Adapter (optional)  ──▶  AI Backend (OpenAI / Ollama / custom)
        │
        ▼
   EmbeddedChat
   ├── React UI
   ├── API Layer  ──▶  Rocket.Chat Server
   └── Auth
```

The AI backend is **completely independent** of the Rocket.Chat server. EmbeddedChat has **zero dependency** on this package — the host app owns the entire AI integration.

## Installation

```bash
npm install @embeddedchat/ai-adapter
```

## Quick Start

```jsx
import { EmbeddedChat } from '@embeddedchat/react';
import { OpenAIAdapter } from '@embeddedchat/ai-adapter';

const adapter = new OpenAIAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  tasks: {
    chat: { model: 'gpt-4o-mini', systemPrompt: 'Be concise and helpful.' },
    composer: {
      model: 'gpt-4o',
      systemPrompt: 'Return only the requested text transformation.',
      temperature: 0,
    },
    replySuggestions: {
      model: 'gpt-4o-mini',
      systemPrompt: 'Return only short, natural replies for the current user.',
      temperature: 0,
      maxTokens: 90,
    },
  },
});

<EmbeddedChat
  host="https://chat.example.com"
  roomId="GENERAL"
  aiAdapter={adapter}
/>
```

When `aiAdapter` is provided, EmbeddedChat adds a header-level **Catch up** action, automatic reply suggestions, and selection-based composer actions. Catch ups are stored locally as **You only** messages; they are never sent to Rocket.Chat.

When `aiAdapter` is **not** provided: zero UI changes, zero bundle size impact.

## Built-in Adapters

### OpenAIAdapter

```typescript
import { OpenAIAdapter } from '@embeddedchat/ai-adapter';

const adapter = new OpenAIAdapter({
  apiKey: 'sk-...',           // optional if using a proxy via baseUrl
  model: 'gpt-4o',            // default: 'gpt-4o'
  maxTokens: 500,             // default: 500
  baseUrl: 'https://api.openai.com/v1',  // override for proxies
  headers: { 'X-Custom-Key': '...' },    // extra headers forwarded to every request
  assistantUsername: 'ai-bot',           // RC username of the AI — maps its messages to 'assistant' role
  tasks: { /* optional task-specific model and prompt configuration */ },
});
```

### GeminiAdapter

```typescript
import { GeminiAdapter } from '@embeddedchat/ai-adapter';

const adapter = new GeminiAdapter({
  apiKey: 'AIza...',          // optional if using a proxy via baseUrl
  model: 'gemini-2.0-flash',  // default
  baseUrl: 'https://generativelanguage.googleapis.com',  // override for proxies
  headers: { 'X-Custom-Key': '...' },                    // extra headers
  assistantUsername: 'ai-bot',                            // RC username of the AI — maps its messages to 'model' role
});
```

### OllamaAdapter (local / self-hosted)

```typescript
import { OllamaAdapter } from '@embeddedchat/ai-adapter';

const adapter = new OllamaAdapter({
  baseUrl: 'http://localhost:11434',  // default
  model: 'llama3',                    // default
  headers: { 'X-Custom-Key': '...' }, // useful when Ollama is behind an auth proxy
  assistantUsername: 'ai-bot',        // RC username of the AI — maps its messages to 'assistant' role
});
```

No API key required for Ollama. Runs entirely on your own hardware — ideal for privacy-conscious deployments.

## Task configuration

Every built-in adapter accepts `tasks`. This lets one adapter select a model and system prompt for each EmbeddedChat task instead of keeping prompts inside provider implementations.

```typescript
const adapter = new OpenAIAdapter({
  apiKey: 'sk-...',
  model: 'gpt-4o-mini', // fallback for tasks without a model override
  tasks: {
    chat: {
      systemPrompt: 'Answer clearly and concisely.',
    },
    composer: {
      model: 'gpt-4o',
      systemPrompt: 'Return only the transformed source text.',
      temperature: 0,
    },
    replySuggestions: {
      model: 'gpt-4o-mini',
      systemPrompt: 'Return three short replies and no transcript labels.',
      temperature: 0,
      maxTokens: 90,
    },
  },
});
```

The available task keys are `chat`, `composer`, and `replySuggestions`. All task fields are optional. If a task has no configuration, the adapter uses its top-level model and no system prompt.

## Writing a Custom Adapter

Implement `IAIAdapter` or extend `BaseAIAdapter`:

```typescript
import { BaseAIAdapter, AIContext, AIResponse } from '@embeddedchat/ai-adapter';

export class MyCustomAdapter extends BaseAIAdapter {
  name = 'My AI';

  async sendPrompt(context: AIContext, message: string): Promise<AIResponse> {
    const reply = await myAIService.chat(message);
    return { text: reply };
  }

  async isAvailable(): Promise<boolean> {
    return await myAIService.ping();
  }
}
```

`BaseAIAdapter` provides a default `getSuggestions()` implementation that calls `sendPrompt()`. Override it for provider-specific optimisation.

## Interface

```typescript
interface IAIAdapter {
  name: string;
  sendPrompt(context: AIContext, message: string): Promise<AIResponse>;
  getSuggestions?(conversation: Message[]): Promise<string[]>;
  isAvailable(): Promise<boolean>;
}

interface AIContext {
  roomId: string;
  userId: string;
  history: Message[];
  metadata?: { federated?: boolean; task?: AITaskType };
}

type AITaskType = 'chat' | 'composer' | 'replySuggestions';

interface AITaskConfig {
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIResponse {
  text: string;
  suggestions?: string[];
}
```

## License

MIT
