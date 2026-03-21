/**
 * A single chat message passed to the AI adapter.
 */
export interface ChatMessage {
  _id: string;
  msg: string;
  u: {
    _id: string;
    username: string;
    name?: string;
  };
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
 * Result from processMessage.
 */
export interface ProcessedMessage {
  /** Original text */
  original: string;
  /** AI-enhanced or classified text */
  enhanced: string;
  /** Category assigned by the AI */
  category: 'question' | 'statement' | 'request' | 'greeting' | 'other';
  /** Detected sentiment */
  sentiment: 'positive' | 'neutral' | 'negative';
}

/**
 * The core AI adapter interface.
 * Implement this interface to add any AI provider to EmbeddedChat.
 */
export interface AIAdapter {
  /** Human-readable name of the provider, shown in the UI */
  readonly providerName: string;

  /**
   * Returns smart reply suggestions based on recent conversation context.
   * @param context - recent messages + current user info
   */
  getSmartReplies(context: SmartReplyContext): Promise<SmartReplySuggestion[]>;

  /**
   * Summarizes a thread of messages into a short paragraph.
   * @param messages - the messages in the thread
   */
  summarizeThread(messages: ChatMessage[]): Promise<string>;

  /**
   * Processes a single message before sending — enhancement, classification, etc.
   * @param message - raw text the user is about to send
   */
  processMessage(message: string): Promise<ProcessedMessage>;
}

/**
 * Supported built-in provider keys.
 * Use 'custom' to bring your own adapter via AdapterFactory.register().
 */
export type ProviderKey = 'mock' | 'openai' | 'rocketchat';

export interface AdapterFactoryConfig {
  provider: ProviderKey;
  /** Required when provider === 'openai' */
  openaiApiKey?: string;
  /** RocketChat server URL, used by the rocketchat provider */
  rocketchatHost?: string;
}
