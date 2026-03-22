import type {
  AIAdapter,
  ChatMessage,
  SmartReplyContext,
  SmartReplySuggestion,
} from '../types';

/**
 * OpenAIAdapter — connects EmbeddedChat to any OpenAI-compatible API.
 *
 * Works with:
 *   - OpenAI (api.openai.com)
 *   - Azure OpenAI
 *   - Ollama, LM Studio, or any server that exposes the /v1/chat/completions endpoint
 *
 * Usage:
 *   const adapter = new OpenAIAdapter({ apiKey: 'sk-...' });
 *   <EmbeddedChat host="..." roomId="..." aiAdapter={adapter} />
 */
export class OpenAIAdapter implements AIAdapter {
  readonly providerName = 'OpenAI';

  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;

  constructor(options: {
    apiKey: string;
    model?: string;
    /** Override for Azure OpenAI or local servers */
    baseUrl?: string;
  }) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? 'gpt-4o-mini';
    this.baseUrl = options.baseUrl ?? 'https://api.openai.com/v1';
  }

  // ─── private helper ────────────────────────────────────────────────────────

  private async chat(systemPrompt: string, userPrompt: string): Promise<string> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.4,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI request failed (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? '';
  }

  // ─── AIAdapter interface ────────────────────────────────────────────────────

  async getSmartReplies(ctx: SmartReplyContext): Promise<SmartReplySuggestion[]> {
    const history = ctx.recentMessages
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join('\n');

    const raw = await this.chat(
      'You are a chat assistant. Given a conversation history, suggest 3 short, natural reply options for the user. ' +
        'Respond with exactly 3 lines — one reply per line — no numbering, no extra text.',
      `Conversation:\n${history}\n\nUser: ${ctx.currentUsername}\nSuggest 3 replies:`
    );

    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((text, i) => ({
        id: `sr-${i}`,
        text,
        confidence: 1 - i * 0.1,
      }));
  }

  async summarizeThread(messages: ChatMessage[]): Promise<string> {
    const history = messages.map((m) => `${m.u.username}: ${m.msg}`).join('\n');

    return this.chat(
      'You are a chat assistant. Summarise the following thread in 2–3 sentences.',
      history
    );
  }
}
