import { LayoutBlock } from "@rocket.chat/ui-kit";
import { BaseAIAdapter } from "../BaseAIAdapter";
import { AIContext, AIResponse, AITaskConfigs } from "../types";
import {
  UI_KIT_GENERATION_SYSTEM_PROMPT,
  UI_KIT_JSON_SCHEMA,
  validateAndExtractBlocks,
} from "../utils/validation";

interface OpenAIConfig {
  apiKey?: string;
  model?: string;
  maxTokens?: number;
  baseUrl?: string;
  headers?: Record<string, string>;
  assistantUsername?: string;
  tasks?: AITaskConfigs;
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
      tasks: {},
      ...config,
    };
  }

  async sendPrompt(context: AIContext, message: string): Promise<AIResponse> {
    const task = this.config.tasks[context.metadata?.task ?? "chat"] ?? {};

    const chatMessages = this.buildChatMessages(
      context,
      message,
      task.systemPrompt ?? "",
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
        model: task.model ?? this.config.model,
        messages: chatMessages,
        max_tokens: task.maxTokens ?? this.config.maxTokens,
        ...(task.temperature !== undefined && {
          temperature: task.temperature,
        }),
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    return { text };
  }

  private buildResponseFormat(model: string): Record<string, unknown> {
    const strictCapableModels = [
      "gpt-4o",
      "gpt-4o-mini",
      "gpt-4-turbo",
      "gpt-4",
      "gpt-3.5-turbo",
    ];

    if (!strictCapableModels.some((candidate) => model.toLowerCase().includes(candidate))) {
      return { type: "json_object" };
    }

    return {
      type: "json_schema",
      json_schema: {
        name: "ui_kit_blocks",
        strict: true,
        schema: UI_KIT_JSON_SCHEMA,
      },
    };
  }

  async generateUIBlocks(
    prompt: string,
    existingBlocks?: LayoutBlock[]
  ): Promise<{ blocks: LayoutBlock[]; componentType: string }> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.config.headers,
    };
    if (this.config.apiKey) headers.Authorization = `Bearer ${this.config.apiKey}`;

    const requestBody = {
      model: this.config.model,
      messages: [
        { role: "system", content: UI_KIT_GENERATION_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Prompt: "${prompt}"\n\nExisting Blocks:\n${JSON.stringify(existingBlocks ?? [])}`,
        },
      ],
      max_tokens: Math.max(this.config.maxTokens, 2000),
      response_format: this.buildResponseFormat(this.config.model),
    };
    const base = this.config.baseUrl.replace(/\/$/, "");
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const data = await res.json();
    return validateAndExtractBlocks(data.choices?.[0]?.message?.content ?? "");
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
