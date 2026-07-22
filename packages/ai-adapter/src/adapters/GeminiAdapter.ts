import { BaseAIAdapter } from "../BaseAIAdapter";
import { AIContext, AIResponse } from "../types";

interface GeminiConfig {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  headers?: Record<string, string>;
  assistantUsername?: string;
}

export class GeminiAdapter extends BaseAIAdapter {
  name = "Gemini";
  private config: Required<GeminiConfig>;

  constructor(config: GeminiConfig) {
    super();
    this.config = {
      apiKey: "",
      model: "gemini-2.0-flash",
      baseUrl: "https://generativelanguage.googleapis.com",
      headers: {},
      assistantUsername: "",
      ...config,
    };
  }

  private get endpoint() {
    const keyParam = this.config.apiKey ? `?key=${this.config.apiKey}` : "";
    const base = this.config.baseUrl.replace(/\/$/, "");
    return `${base}/v1beta/models/${this.config.model}:generateContent${keyParam}`;
  }

  async sendPrompt(context: AIContext, message: string): Promise<AIResponse> {
    const history = context.history.slice(-10);
    const contents: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }> = [];

    for (const m of history) {
      const role =
        this.config.assistantUsername &&
        m.u.username === this.config.assistantUsername
          ? "model"
          : "user";
      const text = `${m.u.username}: ${m.msg}`;

      const lastContent = contents[contents.length - 1];
      if (lastContent && lastContent.role === role) {
        lastContent.parts[0].text += `\n${text}`;
      } else {
        contents.push({
          role,
          parts: [{ text }],
        });
      }
    }

    const currentRole = "user";
    const lastContent = contents[contents.length - 1];
    if (lastContent && lastContent.role === currentRole) {
      lastContent.parts[0].text += `\n${message}`;
    } else {
      contents.push({
        role: currentRole,
        parts: [{ text: message }],
      });
    }

    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.config.headers,
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [
            {
              text: `You are a helpful assistant inside a chat room. Keep responses concise and relevant.${
                context.metadata?.federated
                  ? " This is a federated Matrix room."
                  : ""
              }`,
            },
          ],
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return { text };
  }

  async isAvailable(): Promise<boolean> {
    try {
      const keyParam = this.config.apiKey ? `?key=${this.config.apiKey}` : "";
      const base = this.config.baseUrl.replace(/\/$/, "");
      const res = await fetch(`${base}/v1beta/models${keyParam}`, {
        headers: this.config.headers,
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}
