import test from "node:test";
import assert from "node:assert/strict";
import { OpenAIAdapter } from "../dist/index.mjs";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("OpenAIAdapter initializes with default configurations", () => {
  const adapter = new OpenAIAdapter({});
  assert.equal(adapter.name, "OpenAI");
});

test("OpenAIAdapter sendPrompt formats headers, payload, and extracts content", async () => {
  let requestedUrl = "";
  let requestOptions = null;

  globalThis.fetch = async (url, options) => {
    requestedUrl = String(url);
    requestOptions = options;
    return {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: { content: "OpenAI assistant reply" },
          },
        ],
      }),
    };
  };

  const adapter = new OpenAIAdapter({
    apiKey: "sk-test-token",
    baseUrl: "https://api.openai.com/v1",
    headers: { "X-Custom-OpenAI": "enabled" },
    tasks: {
      chat: {
        model: "gpt-4o-mini",
        systemPrompt: "Be friendly.",
        temperature: 0.7,
        maxTokens: 150,
      },
    },
  });

  const context = {
    roomId: "room-1",
    userId: "u1",
    history: [],
    metadata: { task: "chat" },
  };

  const response = await adapter.sendPrompt(context, "Explain recursion");

  assert.equal(response.text, "OpenAI assistant reply");
  assert.equal(requestedUrl, "https://api.openai.com/v1/chat/completions");
  assert.equal(requestOptions.method, "POST");
  assert.equal(requestOptions.headers["Authorization"], "Bearer sk-test-token");
  assert.equal(requestOptions.headers["X-Custom-OpenAI"], "enabled");

  const body = JSON.parse(requestOptions.body);
  assert.equal(body.model, "gpt-4o-mini");
  assert.equal(body.max_tokens, 150);
  assert.equal(body.temperature, 0.7);
  assert.equal(body.messages[0].role, "system");
  assert.equal(body.messages[0].content, "Be friendly.");
  assert.equal(body.messages[1].role, "user");
  assert.equal(body.messages[1].content, "Explain recursion");
});

test("OpenAIAdapter sendPrompt throws error on API failure", async () => {
  globalThis.fetch = async () => ({
    ok: false,
    status: 401,
  });

  const adapter = new OpenAIAdapter({ apiKey: "invalid-key" });
  const context = { roomId: "r1", userId: "u1", history: [] };

  await assert.rejects(
    async () => {
      await adapter.sendPrompt(context, "Hello");
    },
    (err) => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes("OpenAI API error: 401"));
      return true;
    }
  );
});

test("OpenAIAdapter generateUIBlocks requests schema and validates response", async () => {
  let capturedBody = null;

  globalThis.fetch = async (_url, options) => {
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                componentType: "info",
                blocks: [
                  {
                    type: "section",
                    text: { type: "plain_text", text: "Generated Section" },
                    accessory: null,
                  },
                ],
              }),
            },
          },
        ],
      }),
    };
  };

  const adapter = new OpenAIAdapter({
    apiKey: "sk-test",
    model: "gpt-4o",
  });

  const result = await adapter.generateUIBlocks("Show general info");

  assert.equal(result.componentType, "info");
  assert.equal(result.blocks.length, 1);
  assert.equal(result.blocks[0].type, "section");

  assert.equal(capturedBody.response_format.type, "json_schema");
  assert.equal(capturedBody.response_format.json_schema.strict, true);
});

test("OpenAIAdapter uses json_object fallback for non-strict models", async () => {
  let capturedBody = null;

  globalThis.fetch = async (_url, options) => {
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                componentType: "info",
                blocks: [
                  {
                    type: "section",
                    text: { type: "plain_text", text: "Custom model section" },
                    accessory: null,
                  },
                ],
              }),
            },
          },
        ],
      }),
    };
  };

  const adapter = new OpenAIAdapter({
    apiKey: "sk-test",
    model: "custom-open-source-llm",
  });

  await adapter.generateUIBlocks("Show test block");
  assert.deepEqual(capturedBody.response_format, { type: "json_object" });
});

test("OpenAIAdapter isAvailable checks /models endpoint", async () => {
  let pingUrl = "";
  let authHeader = "";

  globalThis.fetch = async (url, options) => {
    pingUrl = String(url);
    authHeader = options?.headers?.Authorization;
    return { ok: true };
  };

  const adapter = new OpenAIAdapter({ apiKey: "sk-test" });
  const available = await adapter.isAvailable();

  assert.equal(available, true);
  assert.equal(pingUrl, "https://api.openai.com/v1/models");
  assert.equal(authHeader, "Bearer sk-test");
});

test("OpenAIAdapter isAvailable returns false on network error", async () => {
  globalThis.fetch = async () => {
    throw new Error("Network timeout");
  };

  const adapter = new OpenAIAdapter({ apiKey: "sk-test" });
  const available = await adapter.isAvailable();

  assert.equal(available, false);
});
