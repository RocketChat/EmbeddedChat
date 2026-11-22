import test from "node:test";
import assert from "node:assert/strict";
import { GeminiAdapter } from "../dist/index.mjs";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("GeminiAdapter initializes with default configurations", () => {
  const adapter = new GeminiAdapter({});
  assert.equal(adapter.name, "Gemini");
});

test("GeminiAdapter sendPrompt formats contents and task configs correctly", async () => {
  let requestedUrl = "";
  let requestOptions = null;

  globalThis.fetch = async (url, options) => {
    requestedUrl = String(url);
    requestOptions = options;
    return {
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: "Gemini generated answer" }],
            },
          },
        ],
      }),
    };
  };

  const adapter = new GeminiAdapter({
    apiKey: "test-api-key",
    assistantUsername: "gemini-bot",
    headers: { "X-Custom-Test": "true" },
    tasks: {
      chat: {
        model: "gemini-2.0-flash-lite",
        systemPrompt: "Be concise.",
        temperature: 0.2,
        maxTokens: 100,
      },
    },
  });

  const context = {
    roomId: "room-1",
    userId: "u1",
    history: [
      {
        _id: "1",
        msg: "Hello bot",
        u: { _id: "u1", username: "alice" },
        ts: new Date(),
      },
      {
        _id: "2",
        msg: "Hi Alice!",
        u: { _id: "u2", username: "gemini-bot" },
        ts: new Date(),
      },
    ],
    metadata: { task: "chat" },
  };

  const response = await adapter.sendPrompt(context, "What is 2+2?");

  assert.equal(response.text, "Gemini generated answer");
  assert.ok(
    requestedUrl.includes(
      "/v1beta/models/gemini-2.0-flash-lite:generateContent?key=test-api-key"
    )
  );
  assert.equal(requestOptions.method, "POST");
  assert.equal(requestOptions.headers["X-Custom-Test"], "true");

  const body = JSON.parse(requestOptions.body);
  assert.equal(body.contents.length, 3);
  assert.equal(body.contents[0].role, "user");
  assert.equal(body.contents[0].parts[0].text, "alice: Hello bot");
  assert.equal(body.contents[1].role, "model");
  assert.equal(body.contents[1].parts[0].text, "gemini-bot: Hi Alice!");
  assert.equal(body.contents[2].role, "user");
  assert.equal(body.contents[2].parts[0].text, "What is 2+2?");

  assert.equal(body.systemInstruction.parts[0].text, "Be concise.");
  assert.equal(body.generationConfig.temperature, 0.2);
  assert.equal(body.generationConfig.maxOutputTokens, 100);
});

test("GeminiAdapter sendPrompt throws error when response is not ok", async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 403,
  });

  const adapter = new GeminiAdapter({ apiKey: "bad-key" });
  const context = { roomId: "r1", userId: "u1", history: [] };

  await assert.rejects(
    async () => {
      await adapter.sendPrompt(context, "Hi");
    },
    (err) => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes("Gemini API error: 403"));
      return true;
    }
  );
});

test("GeminiAdapter isAvailable returns true when API is responsive", async () => {
  let pingUrl = "";
  globalThis.fetch = async (url) => {
    pingUrl = String(url);
    return { ok: true };
  };

  const adapter = new GeminiAdapter({ apiKey: "my-key" });
  const available = await adapter.isAvailable();

  assert.equal(available, true);
  assert.ok(pingUrl.includes("/v1beta/models?key=my-key"));
});

test("GeminiAdapter isAvailable returns false on failure or network error", async () => {
  globalThis.fetch = async () => {
    throw new Error("Connection refused");
  };

  const adapter = new GeminiAdapter({ apiKey: "my-key" });
  const available = await adapter.isAvailable();

  assert.equal(available, false);
});

test("GeminiAdapter generateUIBlocks throws not implemented error", async () => {
  const adapter = new GeminiAdapter({});
  await assert.rejects(
    async () => {
      await adapter.generateUIBlocks("create a form");
    },
    (err) => {
      assert.ok(err instanceof Error);
      assert.ok(
        err.message.includes(
          "generateUIBlocks not implemented for Gemini adapter"
        )
      );
      return true;
    }
  );
});
