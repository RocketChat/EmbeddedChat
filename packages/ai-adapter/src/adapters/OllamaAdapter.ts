import { BaseAIAdapter } from "../BaseAIAdapter";
import { AIContext, AIResponse, AITaskConfigs } from "../types";

interface OllamaConfig {
  baseUrl?: string;
  model?: string;
  headers?: Record<string, string>;
  assistantUsername?: string;
  tasks?: AITaskConfigs;
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
      tasks: {},
      ...config,
    };
  }

  async sendPrompt(context: AIContext, message: string): Promise<AIResponse> {
    const task = this.config.tasks[context.metadata?.task ?? "chat"] ?? {};
    const options: { temperature?: number; num_predict?: number } = {};
    if (task.temperature !== undefined) options.temperature = task.temperature;
    if (task.maxTokens !== undefined) options.num_predict = task.maxTokens;

    const chatMessages = this.buildChatMessages(
      context,
      message,
      task.systemPrompt ?? "",
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
        model: task.model ?? this.config.model,
        messages: chatMessages,
        stream: false,
        ...(Object.keys(options).length > 0 && { options }),
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
