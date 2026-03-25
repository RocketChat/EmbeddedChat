import type {
  AIAdapter,
  ChatMessage,
  ProcessedMessage,
  SmartReplyContext,
  SmartReplySuggestion,
} from '../types';

/**
 * Context-aware keyword banks for generating realistic suggestions.
 */
const REPLY_BANKS = {
  question: [
    'Great question! Let me check on that.',
    "I'll look into it and get back to you shortly.",
    'Good point — here is what I know so far.',
    'That depends on a few factors. Can you share more context?',
  ],
  greeting: [
    'Hey! Good to see you here.',
    'Hello! How can I help today?',
    'Hi there! Hope everything is going well.',
  ],
  request: [
    'On it! I will update you once it is done.',
    'Sure, I can take care of that.',
    'Absolutely, let me handle that right now.',
    'Consider it done — will follow up soon.',
  ],
  thanks: [
    'Happy to help!',
    'No problem at all!',
    'Glad that worked out.',
    'Anytime!',
  ],
  problem: [
    'Sorry to hear that. Let me dig into it.',
    'That does sound frustrating — I will investigate.',
    'Thanks for flagging this. I am on it.',
    'I understand the issue. Working on a fix now.',
  ],
  default: [
    'Sounds good to me.',
    'Got it, thanks for the update.',
    'Makes sense. Let me know if you need anything.',
    'Noted! I will keep that in mind.',
    'Appreciate you sharing that.',
  ],
};

type ReplyCategory = keyof typeof REPLY_BANKS;

function detectCategory(text: string): ReplyCategory {
  const lower = text.toLowerCase();
  if (/\?/.test(lower) || /^(what|how|why|when|where|who|is|are|can|could|would|should|do|does)\b/.test(lower)) {
    return 'question';
  }
  if (/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(lower)) {
    return 'greeting';
  }
  if (/\b(please|could you|can you|would you|need you to|request)\b/.test(lower)) {
    return 'request';
  }
  if (/\b(thank|thanks|appreciate|grateful)\b/.test(lower)) {
    return 'thanks';
  }
  if (/\b(error|bug|issue|problem|broken|failed|crash|wrong)\b/.test(lower)) {
    return 'problem';
  }
  return 'default';
}

function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function buildSummary(messages: ChatMessage[]): string {
  if (messages.length === 0) return 'No messages to summarize.';
  const participants = [...new Set(messages.map((m) => m.u.username))];
  const first = messages[0];
  const last = messages[messages.length - 1];
  const topics = extractTopics(messages.map((m) => m.msg).join(' '));
  const participantStr =
    participants.length === 1
      ? participants[0]
      : `${participants.slice(0, -1).join(', ')} and ${participants[participants.length - 1]}`;

  return (
    `This thread has ${messages.length} message${messages.length !== 1 ? 's' : ''} ` +
    `from ${participantStr}. ` +
    `${first.u.username} started the conversation${topics.length > 0 ? ` discussing ${topics.join(', ')}` : ''}. ` +
    `The last message was from ${last.u.username}: "${last.msg.slice(0, 80)}${last.msg.length > 80 ? '…' : ''}"`
  );
}

function extractTopics(text: string): string[] {
  const techKeywords = [
    'API', 'bug', 'feature', 'deploy', 'build', 'test', 'review',
    'PR', 'branch', 'merge', 'release', 'performance', 'security',
    'database', 'auth', 'login', 'error', 'fix', 'update',
  ];
  return techKeywords.filter((k) =>
    text.toLowerCase().includes(k.toLowerCase())
  ).slice(0, 3);
}

/**
 * MockAIAdapter — zero-API-key adapter with context-aware responses.
 * Ideal for demos, development, and offline environments.
 */
export class MockAIAdapter implements AIAdapter {
  readonly providerName = 'Mock AI';

  async getSmartReplies(context: SmartReplyContext): Promise<SmartReplySuggestion[]> {
    // Simulate brief network latency
    await delay(120);

    // Find the last message from someone other than the current user
    const lastMessage = [...context.recentMessages]
      .reverse()
      .find((m) => m.u.username !== context.currentUsername);

    if (!lastMessage) return [];

    const category = detectCategory(lastMessage.msg);
    const bank = REPLY_BANKS[category];
    const chosen = pickN(bank, 3);

    return chosen.map((text, i) => ({
      id: `mock-${category}-${i}`,
      text,
      confidence: parseFloat((0.95 - i * 0.1).toFixed(2)),
    }));
  }

  async summarizeThread(messages: ChatMessage[]): Promise<string> {
    await delay(200);
    return buildSummary(messages);
  }

  async processMessage(message: string): Promise<ProcessedMessage> {
    await delay(80);
    const lower = message.toLowerCase();

    const category = (() => {
      if (message.includes('?')) return 'question' as const;
      if (/\b(hi|hello|hey)\b/.test(lower)) return 'greeting' as const;
      if (/\b(please|can you|could you)\b/.test(lower)) return 'request' as const;
      if (/\b(is|are|the|this)\b/.test(lower)) return 'statement' as const;
      return 'other' as const;
    })();

    const sentiment = (() => {
      if (/\b(great|thanks|awesome|love|perfect|nice|good)\b/.test(lower)) return 'positive' as const;
      if (/\b(error|bug|broken|fail|bad|wrong|issue|problem)\b/.test(lower)) return 'negative' as const;
      return 'neutral' as const;
    })();

    return {
      original: message,
      enhanced: message,
      category,
      sentiment,
    };
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
