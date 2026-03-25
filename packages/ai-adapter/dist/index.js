'use strict';

class OpenAIAdapter {
  providerName = "OpenAI";
  apiKey;
  model;
  baseUrl;
  constructor(options) {
    this.apiKey = options.apiKey;
    this.model = options.model ?? "gpt-4o-mini";
    this.baseUrl = options.baseUrl ?? "https://api.openai.com/v1";
  }
  // ─── private helper ────────────────────────────────────────────────────────
  async chat(systemPrompt, userPrompt) {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.model,
        temperature: 0.4,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ]
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI request failed (${res.status}): ${err}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  }
  // ─── AIAdapter interface ────────────────────────────────────────────────────
  async getSmartReplies(ctx) {
    const history = ctx.recentMessages.map((m) => `${m.u.username}: ${m.msg}`).join("\n");
    const raw = await this.chat(
      "You are a chat assistant. Given a conversation history, suggest 3 short, natural reply options for the user. Respond with exactly 3 lines \u2014 one reply per line \u2014 no numbering, no extra text.",
      `Conversation:
${history}

User: ${ctx.currentUsername}
Suggest 3 replies:`
    );
    return raw.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 3).map((text, i) => ({
      id: `sr-${i}`,
      text,
      confidence: 1 - i * 0.1
    }));
  }
  async summarizeThread(messages) {
    const history = messages.map((m) => `${m.u.username}: ${m.msg}`).join("\n");
    return this.chat(
      "You are a chat assistant. Summarise the following thread in 2\u20133 sentences.",
      history
    );
  }
}

exports.OpenAIAdapter = OpenAIAdapter;
//# sourceMappingURL=index.js.map
