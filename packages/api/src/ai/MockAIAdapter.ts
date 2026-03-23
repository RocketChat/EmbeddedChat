import { IAIAdapter, RCMessage } from "./IAIAdapter";

export class MockAIAdapter implements IAIAdapter {
  async suggestReply(context: RCMessage[]): Promise<string[]> {
    const lastMsg = context[context.length - 1]?.msg ?? "";
    // Simple rule-based mock — shows the shape works
    if (lastMsg.includes("?")) {
      return [
        "I'll look into this.",
        "Can you share more details?",
        "Sure, let me check.",
      ];
    }
    return ["Got it, thanks!", "Understood.", "Will do."];
  }

  async summarizeThread(messages: RCMessage[]): Promise<string> {
    return `Thread of ${messages.length} messages. Started by @${messages[0]?.u?.username ?? "unknown"}: "${messages[0]?.msg?.slice(0, 60)}..."`;
  }

  async moderateMessage(
    text: string
  ): Promise<{ flagged: boolean; reason?: string }> {
    // Mock: flag nothing
    return { flagged: false };
  }
}
