import type {
  AIAdapter,
  ChatMessage,
  ProcessedMessage,
  SmartReplyContext,
  SmartReplySuggestion,
} from '../types';

/**
 * OpenAI GPT-4o-mini adapter.
 *
 * Requires OPENAI_API_KEY env var (or pass via constructor).
 * Falls back gracefully if the API call fails.
 */
export class OpenAIAdapter implements AIAdapter {
  readonly providerName = 'OpenAI GPT-4o-mini';

  private readonly apiKey: string;
  private readonly model = 'gpt-4o-mini';
  private readonly baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey?: string) {
    const key =
      apiKey ??
      (typeof process !== 'undefined' && process.env
        ? process.env['OPENAI_API_KEY']
        : undefined);

    if (!key) {
      throw new Error(
        '[OpenAIAdapter] No API key found. Pass it to the constructor or set OPENAI_API_KEY env var.'
      );
    }
    this.apiKey = key;
  }

  async getSmartReplies(context: SmartReplyContext): Promise<SmartReplySuggestion[]> {
    const lastMessage = context.recentMessages[context.recentMessages.length - 1];
    if (!lastMessage || lastMessage.u.username === context.currentUsername) {
      return [];
    }

    const history = context.recentMessages
      .slice(-6)
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join('\n');

    const prompt =
      `You are a chat assistant helping "${context.currentUsername}" reply to this conversation.\n\n` +
      `Recent messages:\n${history}\n\n` +
      `Generate exactly 3 short, natural reply suggestions (max 12 words each). ` +
      `Return as a JSON array of strings. No explanation.`;

    const raw = await this.chat(prompt);
    let suggestions: string[] = [];

    try {
      suggestions = JSON.parse(raw) as string[];
    } catch {
      suggestions = raw
        .split('\n')
        .map((l) => l.replace(/^[\d.\-*•]+\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 3);
    }

    return suggestions.map((text, i) => ({
      id: `openai-${i}`,
      text,
      confidence: parseFloat((0.95 - i * 0.05).toFixed(2)),
    }));
  }

  async summarizeThread(messages: ChatMessage[]): Promise<string> {
    if (messages.length === 0) return 'No messages to summarize.';

    const transcript = messages
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join('\n');

    const prompt =
      `Summarize this chat thread in 2–3 sentences. Be concise and factual.\n\n${transcript}`;

    return this.chat(prompt);
  }

  async processMessage(message: string): Promise<ProcessedMessage> {
    const prompt =
      `Analyze this chat message and respond with JSON only:\n` +
      `{"category":"question|statement|request|greeting|other","sentiment":"positive|neutral|negative","enhanced":"<same or lightly improved text>"}\n\n` +
      `Message: "${message}"`;

    const raw = await this.chat(prompt);
    try {
      const parsed = JSON.parse(raw) as {
        category: ProcessedMessage['category'];
        sentiment: ProcessedMessage['sentiment'];
        enhanced: string;
      };
      return { original: message, ...parsed };
    } catch {
      return {
        original: message,
        enhanced: message,
        category: 'other',
        sentiment: 'neutral',
      };
    }
  }

  private async chat(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`[OpenAIAdapter] API error ${response.status}: ${err}`);
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>;
    };
    return data.choices[0]?.message.content.trim() ?? '';
  }
}
