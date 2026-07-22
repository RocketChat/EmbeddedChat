import { BaseAIAdapter } from "../BaseAIAdapter";
import { AIContext, AIResponse } from "../types";

interface OpenAIConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  baseUrl?: string;
  headers?: Record<string, string>;
  assistantUsername?: string;
}

export class OpenAIAdapter extends BaseAIAdapter {
  name = "OpenAI";
  private config: Required<OpenAIConfig>;

  constructor(config: OpenAIConfig) {
    super();
    this.config = {
      apiKey: "",
      model: "gpt-4o",
      maxTokens: 500,
      baseUrl: "https://api.openai.com/v1",
      headers: {},
      assistantUsername: "",
      ...config,
    };
  }

  async sendPrompt(context: AIContext, message: string): Promise<AIResponse> {
    const systemPrompt = `You are a helpful assistant in a chat room.${
      context.metadata?.federated ? " This is a federated Matrix room." : ""
    } Keep responses concise.`;

    const chatMessages = this.buildChatMessages(
      context,
      message,
      systemPrompt,
      this.config.assistantUsername
    );

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.config.headers,
    };

    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }

    const base = this.config.baseUrl.replace(/\/$/, "");
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: this.config.model,
        messages: chatMessages,
        max_tokens: this.config.maxTokens,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    return { text };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const headers: Record<string, string> = {
        ...this.config.headers,
      };
      if (this.config.apiKey) {
        headers["Authorization"] = `Bearer ${this.config.apiKey}`;
      }
      const base = this.config.baseUrl.replace(/\/$/, "");
      const res = await fetch(`${base}/models`, { headers });
      return res.ok;
    } catch {
      return false;
    }
  }
}
