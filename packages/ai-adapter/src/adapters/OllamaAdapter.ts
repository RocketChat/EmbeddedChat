import { BaseAIAdapter } from "../BaseAIAdapter";
import { AIContext, AIResponse } from "../types";

interface OllamaConfig {
  baseUrl?: string;
  model?: string;
  headers?: Record<string, string>;
  assistantUsername?: string;
}

export class OllamaAdapter extends BaseAIAdapter {
  name = "Ollama";
  private config: Required<OllamaConfig>;

  constructor(config: OllamaConfig = {}) {
    super();
    this.config = {
      baseUrl: "http://localhost:11434",
      model: "llama3",
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

    const base = this.config.baseUrl.replace(/\/$/, "");
    const res = await fetch(`${base}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.config.headers,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: chatMessages,
        stream: false,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.message?.content ?? "";
    return { text };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const base = this.config.baseUrl.replace(/\/$/, "");
      const res = await fetch(`${base}/api/tags`, {
        headers: this.config.headers,
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
