# AI Adapter — Architecture

## Overview

The AI adapter integrates into EmbeddedChat using the same **prop-driven** pattern
as `host` and `roomId`. There is no separate provider wrapper; the adapter instance
flows through the existing `RCContext` via `ECOptions`.

```
Consumer code
    │
    │  aiAdapter={new OpenAIAdapter({ apiKey })}
    ▼
<EmbeddedChat host="…" roomId="…" aiAdapter={adapter} />
    │
    │  ECOptions.aiAdapter  (via RCInstanceProvider / RCContext)
    ▼
ChatLayout
    ├── ChatBody
    ├── SmartReplies      ← reads ECOptions.aiAdapter; renders only when present
    └── ChatInput
```

---

## Adapter Interface (`AIAdapter`)

Any object that satisfies this interface can be passed as `aiAdapter`:

```ts
interface AIAdapter {
  readonly providerName: string;

  getSmartReplies(context: SmartReplyContext): Promise<SmartReplySuggestion[]>;
  summarizeThread(messages: ChatMessage[]): Promise<string>;
}
```

The interface is intentionally minimal. Components call methods on the adapter
without knowing which provider backs it — OpenAI, Azure, Ollama, or a custom
implementation all work the same way.

---

## Data Flow

```
[New message arrives in messageStore]
        │
        ▼
SmartReplies (useMessageStore)
        │  calls adapter.getSmartReplies({ recentMessages, currentUsername })
        ▼
OpenAIAdapter → POST /v1/chat/completions
        │
        ▼
SmartReplySuggestion[]  →  rendered as chips above ChatInput
        │
        ▼  user clicks a chip
handleSmartReplySelect (ChatLayout)
        │
        ▼  injects text into ChatInput textarea
User edits / sends → RCInstance.sendMessage(...)
```

---

## Adding the Adapter to EmbeddedChat

```jsx
import { OpenAIAdapter } from '@embeddedchat/ai-adapter';

const adapter = new OpenAIAdapter({ apiKey: process.env.OPENAI_API_KEY });

<EmbeddedChat
  host="https://your-rocketchat.com"
  roomId="GENERAL"
  aiAdapter={adapter}   // ← single prop, no wrapper needed
/>
```

When `aiAdapter` is omitted, every AI component renders `null`. Zero impact on
apps that don't use the feature.

---

## Implementing a Custom Provider

```ts
import type { AIAdapter, SmartReplyContext, SmartReplySuggestion } from '@embeddedchat/ai-adapter';

export class MyProvider implements AIAdapter {
  readonly providerName = 'My Provider';

  async getSmartReplies(ctx: SmartReplyContext): Promise<SmartReplySuggestion[]> {
    // call your own API
    return [{ id: '0', text: 'Sure!', confidence: 0.9 }];
  }

  async summarizeThread(messages) {
    // call your own API
    return 'Summary here.';
  }
}

// Usage — no changes to EmbeddedChat needed:
<EmbeddedChat host="…" roomId="…" aiAdapter={new MyProvider()} />
```

---

## Package Structure

```
packages/ai-adapter/
├── src/
│   ├── types.ts                  ← AIAdapter interface + shared types
│   ├── adapters/
│   │   └── OpenAIAdapter.ts      ← OpenAI-compatible implementation
│   └── index.ts                  ← public exports
└── ARCHITECTURE.md               ← this file

packages/react/src/
├── views/
│   ├── EmbeddedChat.js           ← accepts aiAdapter prop; adds to ECOptions
│   ├── ChatLayout/ChatLayout.js  ← renders SmartReplies when adapter present
│   └── SmartReplies/
│       └── SmartReplies.js       ← reads ECOptions.aiAdapter via useRCContext
└── context/
    └── RCInstance.js             ← ECOptions typedef includes aiAdapter
```

---

## Design Decisions

| Decision | Rationale |
|---|---|
| Prop on `<EmbeddedChat>` (not a wrapper Provider) | Consistent with how `host`, `roomId`, `auth` work. Consumers have one integration point. |
| Adapter interface, not a concrete class | Consumers can bring any provider without forking the repo. |
| Single OpenAI-compatible implementation | Covers OpenAI, Azure OpenAI, Ollama, LM Studio — the majority of real use cases. |
| AI features render `null` when no adapter | Zero-cost for apps that don't use AI. No breaking changes. |
| SmartReplies reads from `ECOptions` | Avoids a second React context; keeps the component tree flat. |
