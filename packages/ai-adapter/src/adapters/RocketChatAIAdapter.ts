import type {
  AIAdapter,
  ChatMessage,
  ProcessedMessage,
  SmartReplyContext,
  SmartReplySuggestion,
} from '../types';

/**
 * RocketChatAIAdapter — stub demonstrating extensibility.
 *
 * This adapter shows how to wire EmbeddedChat's AI layer to
 * RocketChat's built-in AI features (Smart Replies App, AI Assistant)
 * once the server-side endpoints are available.
 *
 * Replace the TODO sections with real RC REST API calls.
 */
export class RocketChatAIAdapter implements AIAdapter {
  readonly providerName = 'RocketChat AI';

  private readonly host: string;

  constructor(host: string = 'http://localhost:3000') {
    this.host = host.replace(/\/$/, '');
  }

  async getSmartReplies(context: SmartReplyContext): Promise<SmartReplySuggestion[]> {
    // TODO: POST /api/v1/ai/smart-replies when available in RC server
    // const response = await fetch(`${this.host}/api/v1/ai/smart-replies`, {
    //   method: 'POST',
    //   headers: { 'X-Auth-Token': token, 'X-User-Id': userId, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ messages: context.recentMessages }),
    // });
    // return (await response.json()).suggestions;

    void context; // suppress unused warning
    return [
      { id: 'rc-stub-0', text: '[RocketChat AI] Smart reply feature coming soon.', confidence: 0.5 },
    ];
  }

  async summarizeThread(messages: ChatMessage[]): Promise<string> {
    // TODO: POST /api/v1/ai/summarize when available in RC server
    void messages;
    return '[RocketChat AI] Thread summarization is a stub. Implement /api/v1/ai/summarize on your RC server.';
  }

  async processMessage(message: string): Promise<ProcessedMessage> {
    // TODO: POST /api/v1/ai/process-message when available in RC server
    void message;
    return {
      original: message,
      enhanced: message,
      category: 'other',
      sentiment: 'neutral',
    };
  }
}
