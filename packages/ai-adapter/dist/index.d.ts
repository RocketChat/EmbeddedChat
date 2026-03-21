/**
 * A single chat message passed to the AI adapter.
 */
interface ChatMessage {
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
interface SmartReplyContext {
    /** The last N messages in the conversation */
    recentMessages: ChatMessage[];
    /** Currently authenticated username */
    currentUsername: string;
}
/**
 * A single smart reply suggestion.
 */
interface SmartReplySuggestion {
    id: string;
    text: string;
    /** Rough confidence/relevance score 0–1 */
    confidence: number;
}
/**
 * Result from processMessage.
 */
interface ProcessedMessage {
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
interface AIAdapter {
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
type ProviderKey = 'mock' | 'openai' | 'rocketchat';
interface AdapterFactoryConfig {
    provider: ProviderKey;
    /** Required when provider === 'openai' */
    openaiApiKey?: string;
    /** RocketChat server URL, used by the rocketchat provider */
    rocketchatHost?: string;
}

type AdapterConstructor = new (...args: unknown[]) => AIAdapter;
/**
 * AdapterFactory — the single switch that controls which AI provider is active.
 *
 * Usage:
 * ```ts
 * const adapter = AdapterFactory.create({ provider: 'mock' });
 * const adapter = AdapterFactory.create({ provider: 'openai', openaiApiKey: 'sk-...' });
 * ```
 *
 * To add a custom provider:
 * ```ts
 * AdapterFactory.register('my-llm', MyLLMAdapter);
 * const adapter = AdapterFactory.create({ provider: 'my-llm' as ProviderKey });
 * ```
 */
declare class AdapterFactory {
    /**
     * Register a custom adapter under a string key.
     * Call this before `create()` when using a non-built-in provider.
     */
    static register(key: string, ctor: AdapterConstructor): void;
    /**
     * Create an adapter instance from config.
     * Falls back to MockAIAdapter if the requested provider is unavailable
     * (e.g. missing API key) to ensure the widget always works.
     */
    static create(config: AdapterFactoryConfig): AIAdapter;
    /**
     * Returns the list of registered provider keys (built-in + custom).
     */
    static registeredProviders(): string[];
    private static build;
}

/**
 * MockAIAdapter — zero-API-key adapter with context-aware responses.
 * Ideal for demos, development, and offline environments.
 */
declare class MockAIAdapter implements AIAdapter {
    readonly providerName = "Mock AI";
    getSmartReplies(context: SmartReplyContext): Promise<SmartReplySuggestion[]>;
    summarizeThread(messages: ChatMessage[]): Promise<string>;
    processMessage(message: string): Promise<ProcessedMessage>;
}

/**
 * OpenAI GPT-4o-mini adapter.
 *
 * Requires OPENAI_API_KEY env var (or pass via constructor).
 * Falls back gracefully if the API call fails.
 */
declare class OpenAIAdapter implements AIAdapter {
    readonly providerName = "OpenAI GPT-4o-mini";
    private readonly apiKey;
    private readonly model;
    private readonly baseUrl;
    constructor(apiKey?: string);
    getSmartReplies(context: SmartReplyContext): Promise<SmartReplySuggestion[]>;
    summarizeThread(messages: ChatMessage[]): Promise<string>;
    processMessage(message: string): Promise<ProcessedMessage>;
    private chat;
}

/**
 * RocketChatAIAdapter — stub demonstrating extensibility.
 *
 * This adapter shows how to wire EmbeddedChat's AI layer to
 * RocketChat's built-in AI features (Smart Replies App, AI Assistant)
 * once the server-side endpoints are available.
 *
 * Replace the TODO sections with real RC REST API calls.
 */
declare class RocketChatAIAdapter implements AIAdapter {
    readonly providerName = "RocketChat AI";
    private readonly host;
    constructor(host?: string);
    getSmartReplies(context: SmartReplyContext): Promise<SmartReplySuggestion[]>;
    summarizeThread(messages: ChatMessage[]): Promise<string>;
    processMessage(message: string): Promise<ProcessedMessage>;
}

export { type AIAdapter, AdapterFactory, type AdapterFactoryConfig, type ChatMessage, MockAIAdapter, OpenAIAdapter, type ProcessedMessage, type ProviderKey, RocketChatAIAdapter, type SmartReplyContext, type SmartReplySuggestion };
