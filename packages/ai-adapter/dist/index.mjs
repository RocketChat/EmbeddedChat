const REPLY_BANKS = {
  question: [
    "Great question! Let me check on that.",
    "I'll look into it and get back to you shortly.",
    "Good point \u2014 here is what I know so far.",
    "That depends on a few factors. Can you share more context?"
  ],
  greeting: [
    "Hey! Good to see you here.",
    "Hello! How can I help today?",
    "Hi there! Hope everything is going well."
  ],
  request: [
    "On it! I will update you once it is done.",
    "Sure, I can take care of that.",
    "Absolutely, let me handle that right now.",
    "Consider it done \u2014 will follow up soon."
  ],
  thanks: [
    "Happy to help!",
    "No problem at all!",
    "Glad that worked out.",
    "Anytime!"
  ],
  problem: [
    "Sorry to hear that. Let me dig into it.",
    "That does sound frustrating \u2014 I will investigate.",
    "Thanks for flagging this. I am on it.",
    "I understand the issue. Working on a fix now."
  ],
  default: [
    "Sounds good to me.",
    "Got it, thanks for the update.",
    "Makes sense. Let me know if you need anything.",
    "Noted! I will keep that in mind.",
    "Appreciate you sharing that."
  ]
};
function detectCategory(text) {
  const lower = text.toLowerCase();
  if (/\?/.test(lower) || /^(what|how|why|when|where|who|is|are|can|could|would|should|do|does)\b/.test(lower)) {
    return "question";
  }
  if (/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(lower)) {
    return "greeting";
  }
  if (/\b(please|could you|can you|would you|need you to|request)\b/.test(lower)) {
    return "request";
  }
  if (/\b(thank|thanks|appreciate|grateful)\b/.test(lower)) {
    return "thanks";
  }
  if (/\b(error|bug|issue|problem|broken|failed|crash|wrong)\b/.test(lower)) {
    return "problem";
  }
  return "default";
}
function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
function buildSummary(messages) {
  if (messages.length === 0)
    return "No messages to summarize.";
  const participants = [...new Set(messages.map((m) => m.u.username))];
  const first = messages[0];
  const last = messages[messages.length - 1];
  const topics = extractTopics(messages.map((m) => m.msg).join(" "));
  const participantStr = participants.length === 1 ? participants[0] : `${participants.slice(0, -1).join(", ")} and ${participants[participants.length - 1]}`;
  return `This thread has ${messages.length} message${messages.length !== 1 ? "s" : ""} from ${participantStr}. ${first.u.username} started the conversation${topics.length > 0 ? ` discussing ${topics.join(", ")}` : ""}. The last message was from ${last.u.username}: "${last.msg.slice(0, 80)}${last.msg.length > 80 ? "\u2026" : ""}"`;
}
function extractTopics(text) {
  const techKeywords = [
    "API",
    "bug",
    "feature",
    "deploy",
    "build",
    "test",
    "review",
    "PR",
    "branch",
    "merge",
    "release",
    "performance",
    "security",
    "database",
    "auth",
    "login",
    "error",
    "fix",
    "update"
  ];
  return techKeywords.filter(
    (k) => text.toLowerCase().includes(k.toLowerCase())
  ).slice(0, 3);
}
class MockAIAdapter {
  providerName = "Mock AI";
  async getSmartReplies(context) {
    await delay(120);
    const lastMessage = context.recentMessages[context.recentMessages.length - 1];
    if (!lastMessage || lastMessage.u.username === context.currentUsername) {
      return [];
    }
    const category = detectCategory(lastMessage.msg);
    const bank = REPLY_BANKS[category];
    const chosen = pickN(bank, 3);
    return chosen.map((text, i) => ({
      id: `mock-${category}-${i}`,
      text,
      confidence: parseFloat((0.95 - i * 0.1).toFixed(2))
    }));
  }
  async summarizeThread(messages) {
    await delay(200);
    return buildSummary(messages);
  }
  async processMessage(message) {
    await delay(80);
    const lower = message.toLowerCase();
    const category = (() => {
      if (message.includes("?"))
        return "question";
      if (/\b(hi|hello|hey)\b/.test(lower))
        return "greeting";
      if (/\b(please|can you|could you)\b/.test(lower))
        return "request";
      if (/\b(is|are|the|this)\b/.test(lower))
        return "statement";
      return "other";
    })();
    const sentiment = (() => {
      if (/\b(great|thanks|awesome|love|perfect|nice|good)\b/.test(lower))
        return "positive";
      if (/\b(error|bug|broken|fail|bad|wrong|issue|problem)\b/.test(lower))
        return "negative";
      return "neutral";
    })();
    return {
      original: message,
      enhanced: message,
      category,
      sentiment
    };
  }
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class OpenAIAdapter {
  providerName = "OpenAI GPT-4o-mini";
  apiKey;
  model = "gpt-4o-mini";
  baseUrl = "https://api.openai.com/v1";
  constructor(apiKey) {
    const key = apiKey ?? (typeof process !== "undefined" && process.env ? process.env["OPENAI_API_KEY"] : void 0);
    if (!key) {
      throw new Error(
        "[OpenAIAdapter] No API key found. Pass it to the constructor or set OPENAI_API_KEY env var."
      );
    }
    this.apiKey = key;
  }
  async getSmartReplies(context) {
    const lastMessage = context.recentMessages[context.recentMessages.length - 1];
    if (!lastMessage || lastMessage.u.username === context.currentUsername) {
      return [];
    }
    const history = context.recentMessages.slice(-6).map((m) => `${m.u.username}: ${m.msg}`).join("\n");
    const prompt = `You are a chat assistant helping "${context.currentUsername}" reply to this conversation.

Recent messages:
${history}

Generate exactly 3 short, natural reply suggestions (max 12 words each). Return as a JSON array of strings. No explanation.`;
    const raw = await this.chat(prompt);
    let suggestions = [];
    try {
      suggestions = JSON.parse(raw);
    } catch {
      suggestions = raw.split("\n").map((l) => l.replace(/^[\d.\-*•]+\s*/, "").trim()).filter(Boolean).slice(0, 3);
    }
    return suggestions.map((text, i) => ({
      id: `openai-${i}`,
      text,
      confidence: parseFloat((0.95 - i * 0.05).toFixed(2))
    }));
  }
  async summarizeThread(messages) {
    if (messages.length === 0)
      return "No messages to summarize.";
    const transcript = messages.map((m) => `${m.u.username}: ${m.msg}`).join("\n");
    const prompt = `Summarize this chat thread in 2\u20133 sentences. Be concise and factual.

${transcript}`;
    return this.chat(prompt);
  }
  async processMessage(message) {
    const prompt = `Analyze this chat message and respond with JSON only:
{"category":"question|statement|request|greeting|other","sentiment":"positive|neutral|negative","enhanced":"<same or lightly improved text>"}

Message: "${message}"`;
    const raw = await this.chat(prompt);
    try {
      const parsed = JSON.parse(raw);
      return { original: message, ...parsed };
    } catch {
      return {
        original: message,
        enhanced: message,
        category: "other",
        sentiment: "neutral"
      };
    }
  }
  async chat(prompt) {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      })
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`[OpenAIAdapter] API error ${response.status}: ${err}`);
    }
    const data = await response.json();
    return data.choices[0]?.message.content.trim() ?? "";
  }
}

class RocketChatAIAdapter {
  providerName = "RocketChat AI";
  host;
  constructor(host = "http://localhost:3000") {
    this.host = host.replace(/\/$/, "");
  }
  async getSmartReplies(context) {
    return [
      { id: "rc-stub-0", text: "[RocketChat AI] Smart reply feature coming soon.", confidence: 0.5 }
    ];
  }
  async summarizeThread(messages) {
    return "[RocketChat AI] Thread summarization is a stub. Implement /api/v1/ai/summarize on your RC server.";
  }
  async processMessage(message) {
    return {
      original: message,
      enhanced: message,
      category: "other",
      sentiment: "neutral"
    };
  }
}

const registry = /* @__PURE__ */ new Map();
class AdapterFactory {
  /**
   * Register a custom adapter under a string key.
   * Call this before `create()` when using a non-built-in provider.
   */
  static register(key, ctor) {
    registry.set(key, ctor);
  }
  /**
   * Create an adapter instance from config.
   * Falls back to MockAIAdapter if the requested provider is unavailable
   * (e.g. missing API key) to ensure the widget always works.
   */
  static create(config) {
    try {
      return AdapterFactory.build(config);
    } catch (err) {
      console.warn(
        `[AdapterFactory] Failed to create "${config.provider}" adapter \u2014 falling back to Mock.
`,
        err.message
      );
      return new MockAIAdapter();
    }
  }
  /**
   * Returns the list of registered provider keys (built-in + custom).
   */
  static registeredProviders() {
    return ["mock", "openai", "rocketchat", ...registry.keys()];
  }
  static build(config) {
    const key = config.provider;
    if (registry.has(key)) {
      const Ctor = registry.get(key);
      return new Ctor();
    }
    switch (key) {
      case "mock":
        return new MockAIAdapter();
      case "openai":
        return new OpenAIAdapter(config.openaiApiKey);
      case "rocketchat":
        return new RocketChatAIAdapter(config.rocketchatHost);
      default: {
        const exhaustive = key;
        throw new Error(`[AdapterFactory] Unknown provider: "${String(exhaustive)}"`);
      }
    }
  }
}

export { AdapterFactory, MockAIAdapter, OpenAIAdapter, RocketChatAIAdapter };
//# sourceMappingURL=index.mjs.map
