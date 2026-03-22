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
 * The core AI adapter interface.
 *
 * Implement this to add any OpenAI-compatible (or custom) provider.
 * Pass an instance via the `aiAdapter` prop on <EmbeddedChat>.
 */
interface AIAdapter {
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
declare class OpenAIAdapter implements AIAdapter {
    readonly providerName = "OpenAI";
    private readonly apiKey;
    private readonly model;
    private readonly baseUrl;
    constructor(options: {
        apiKey: string;
        model?: string;
        /** Override for Azure OpenAI or local servers */
        baseUrl?: string;
    });
    private chat;
    getSmartReplies(ctx: SmartReplyContext): Promise<SmartReplySuggestion[]>;
    summarizeThread(messages: ChatMessage[]): Promise<string>;
}

export { type AIAdapter, type ChatMessage, OpenAIAdapter, type SmartReplyContext, type SmartReplySuggestion };
