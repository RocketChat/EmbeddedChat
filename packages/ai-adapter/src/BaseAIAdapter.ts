import { IAIAdapter, AIContext, AIResponse, Message } from "./types";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export abstract class BaseAIAdapter implements IAIAdapter {
  abstract name: string;
  abstract sendPrompt(context: AIContext, message: string): Promise<AIResponse>;
  abstract isAvailable(): Promise<boolean>;

  protected buildChatMessages(
    context: AIContext,
    message: string,
    systemPrompt: string,
    assistantUsername = ""
  ): ChatMessage[] {
    const chatMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    for (const item of context.history.slice(-10)) {
      const role =
        assistantUsername && item.u.username === assistantUsername
          ? "assistant"
          : "user";
      const content = `${item.u.username}: ${item.msg}`;
      const lastMessage = chatMessages[chatMessages.length - 1];

      if (lastMessage.role === role) {
        lastMessage.content += `\n${content}`;
      } else {
        chatMessages.push({ role, content });
      }
    }

    const lastMessage = chatMessages[chatMessages.length - 1];
    if (lastMessage.role === "user") {
      lastMessage.content += `\n${message}`;
    } else {
      chatMessages.push({ role: "user", content: message });
    }

    return chatMessages;
  }

  async getSuggestions(
    conversation: Message[],
    context?: AIContext
  ): Promise<string[]> {
    const lastMessages = conversation
      .slice(-5)
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join("\n");

    const ctx: AIContext = context ?? {
      roomId: "",
      userId: "",
      history: conversation,
    };

    const response = await this.sendPrompt(
      ctx,
      `Based on this conversation, suggest exactly 3 short reply options (one per line, no numbering, max 10 words each):\n${lastMessages}`
    );

    if (response.suggestions && response.suggestions.length > 0) {
      return response.suggestions;
    }

    return response.text
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  async summarize(messages: Message[], context?: AIContext): Promise<string> {
    const truncated = messages.slice(-100);
    const content = truncated
      .map((m) => `${m.u.username}: ${m.msg}`)
      .join("\n");

    const ctx: AIContext = context ?? {
      roomId: "",
      userId: "",
      history: truncated,
    };

    const response = await this.sendPrompt(
      ctx,
      `Summarize this conversation concisely in 3-5 sentences:\n${content}`
    );

    return response.text;
  }
}
