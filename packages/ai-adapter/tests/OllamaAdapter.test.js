import test, { mock } from "node:test";
import assert from "node:assert/strict";
import { OllamaAdapter, UI_KIT_JSON_SCHEMA } from "../dist/index.mjs";

test.afterEach(() => {
  mock.reset();
});

test("OllamaAdapter initializes with default configurations", () => {
  const adapter = new OllamaAdapter();
  assert.equal(adapter.name, "Ollama");
});

test("OllamaAdapter sendPrompt formats request and parses message content", async () => {
  let requestedUrl = "";
  let requestOptions = null;

  mock.method(globalThis, "fetch", async (url, options) => {
    requestedUrl = String(url);
    requestOptions = options;
    return {
      ok: true,
      json: async () => ({
        message: { content: "Local llama response" },
      }),
    };
  });

  const adapter = new OllamaAdapter({
    baseUrl: "http://localhost:11434",
    headers: { "X-Ollama-Proxy": "auth-pass" },
    tasks: {
      chat: {
        model: "llama3.2",
        systemPrompt: "Be direct.",
        temperature: 0.1,
        maxTokens: 250,
      },
    },
  });

  const context = {
    roomId: "room-1",
    userId: "u1",
    history: [],
    metadata: { task: "chat" },
  };

  const response = await adapter.sendPrompt(
    context,
    "What is the speed of light?"
  );

  assert.equal(response.text, "Local llama response");
  assert.equal(requestedUrl, "http://localhost:11434/api/chat");
  assert.equal(requestOptions.method, "POST");
  assert.equal(requestOptions.headers["X-Ollama-Proxy"], "auth-pass");

  const body = JSON.parse(requestOptions.body);
  assert.equal(body.model, "llama3.2");
  assert.equal(body.stream, false);
  assert.equal(body.options.temperature, 0.1);
  assert.equal(body.options.num_predict, 250);
  assert.equal(body.messages[0].role, "system");
  assert.equal(body.messages[0].content, "Be direct.");
  assert.equal(body.messages[1].role, "user");
  assert.equal(body.messages[1].content, "What is the speed of light?");
});

test("OllamaAdapter sendPrompt throws error on API failure", async () => {
  mock.method(globalThis, "fetch", async () => ({
    ok: false,
    status: 500,
  }));

  const adapter = new OllamaAdapter();
  const context = { roomId: "r1", userId: "u1", history: [] };

  await assert.rejects(
    async () => {
      await adapter.sendPrompt(context, "Hello");
    },
    (err) => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes("Ollama API error: 500"));
      return true;
    }
  );
});

test("OllamaAdapter generateUIBlocks specifies format schema and validates response", async () => {
  let capturedBody = null;

  mock.method(globalThis, "fetch", async (_url, options) => {
    capturedBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({
        message: {
          content: JSON.stringify({
            componentType: "cta",
            blocks: [
              {
                type: "actions",
                elements: [
                  {
                    type: "button",
                    text: { type: "plain_text", text: "Get Started" },
                    actionId: "start_btn",
                    value: "start",
                  },
                ],
              },
            ],
          }),
        },
      }),
    };
  });

  const adapter = new OllamaAdapter({ model: "gemma4" });
  const result = await adapter.generateUIBlocks("Create a call to action");

  assert.equal(result.componentType, "cta");
  assert.equal(result.blocks.length, 1);
  assert.equal(result.blocks[0].type, "actions");

  assert.equal(capturedBody.model, "gemma4");
  assert.equal(capturedBody.stream, false);
  assert.deepEqual(capturedBody.format, UI_KIT_JSON_SCHEMA);
});

test("OllamaAdapter isAvailable checks /api/tags endpoint", async () => {
  let pingUrl = "";

  mock.method(globalThis, "fetch", async (url) => {
    pingUrl = String(url);
    return { ok: true };
  });

  const adapter = new OllamaAdapter({ baseUrl: "http://localhost:11434/" });
  const available = await adapter.isAvailable();

  assert.equal(available, true);
  assert.equal(pingUrl, "http://localhost:11434/api/tags");
});

test("OllamaAdapter isAvailable returns false when server is offline", async () => {
  mock.method(globalThis, "fetch", async () => {
    throw new Error("connect ECONNREFUSED 127.0.0.1:11434");
  });

  const adapter = new OllamaAdapter();
  const available = await adapter.isAvailable();

  assert.equal(available, false);
});
