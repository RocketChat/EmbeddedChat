/**
 * A single chat message passed to the AI adapter.
 */
export interface ChatMessage {
  _id: string;
  msg: string;
  u: { _id: string; username: string; name?: string };
  ts: Date | string;
}

/**
 * Context provided to getSmartReplies.
 */
export interface SmartReplyContext {
  /** The last N messages in the conversation */
  recentMessages: ChatMessage[];
  /** Currently authenticated username */
  currentUsername: string;
}

/**
 * A single smart reply suggestion.
 */
export interface SmartReplySuggestion {
  id: string;
  text: string;
  /** Rough confidence/relevance score 0–1 */
  confidence: number;
}

/**
 * The core AI adapter interface.
 *
 * Implement this to add any OpenAI-compatible (or custom) provider.
 * Pass an instance via the `aiAdapter` prop on <EmbeddedChat>.
 */
export interface AIAdapter {
  /** Human-readable provider name shown in the UI badge */
  readonly providerName: string;

  /**
   * Returns smart reply suggestions based on recent conversation context.
   */
  getSmartReplies(context: SmartReplyContext): Promise<SmartReplySuggestion[]>;

  /**
   * Summarises a thread of messages into a short paragraph.
   */
  summarizeThread(messages: ChatMessage[]): Promise<string>;
}
