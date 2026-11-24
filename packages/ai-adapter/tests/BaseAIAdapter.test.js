import test from "node:test";
import assert from "node:assert/strict";
import { BaseAIAdapter } from "../dist/index.mjs";

class ConcreteTestAdapter extends BaseAIAdapter {
  name = "TestAdapter";

  constructor(mockHandler = null) {
    super();
    this.mockHandler = mockHandler;
    this.promptsReceived = [];
  }

  async sendPrompt(context, message) {
    this.promptsReceived.push({ context, message });
    if (this.mockHandler) {
      return this.mockHandler(context, message);
    }
    return { text: "Default response" };
  }

  async generateUIBlocks() {
    return { blocks: [], componentType: "info" };
  }

  async isAvailable() {
    return true;
  }

  exposeBuildChatMessages(context, message, systemPrompt, assistantUsername) {
    return this.buildChatMessages(
      context,
      message,
      systemPrompt,
      assistantUsername
    );
  }
}

test("buildChatMessages prepends system prompt when provided", () => {
  const adapter = new ConcreteTestAdapter();
  const context = { roomId: "r1", userId: "u1", history: [] };

  const messages = adapter.exposeBuildChatMessages(
    context,
    "Hello",
    "You are a helpful assistant.",
    "bot"
  );

  assert.equal(messages[0].role, "system");
  assert.equal(messages[0].content, "You are a helpful assistant.");
  assert.equal(messages[1].role, "user");
  assert.equal(messages[1].content, "Hello");
});

test("buildChatMessages maps assistantUsername to assistant and user to user", () => {
  const adapter = new ConcreteTestAdapter();
  const context = {
    roomId: "r1",
    userId: "u1",
    history: [
      {
        _id: "1",
        msg: "Hi bot",
        u: { _id: "u1", username: "alice" },
        ts: new Date(),
      },
      {
        _id: "2",
        msg: "Hello Alice",
        u: { _id: "bot_id", username: "my-bot" },
        ts: new Date(),
      },
    ],
  };

  const messages = adapter.exposeBuildChatMessages(
    context,
    "How are you?",
    "",
    "my-bot"
  );

  assert.equal(messages.length, 3);
  assert.equal(messages[0].role, "user");
  assert.equal(messages[0].content, "alice: Hi bot");
  assert.equal(messages[1].role, "assistant");
  assert.equal(messages[1].content, "my-bot: Hello Alice");
  assert.equal(messages[2].role, "user");
  assert.equal(messages[2].content, "How are you?");
});

test("buildChatMessages merges consecutive messages with the same role", () => {
  const adapter = new ConcreteTestAdapter();
  const context = {
    roomId: "r1",
    userId: "u1",
    history: [
      {
        _id: "1",
        msg: "Message 1",
        u: { _id: "u1", username: "alice" },
        ts: new Date(),
      },
      {
        _id: "2",
        msg: "Message 2",
        u: { _id: "u2", username: "bob" },
        ts: new Date(),
      },
    ],
  };

  const messages = adapter.exposeBuildChatMessages(
    context,
    "Message 3",
    "",
    "my-bot"
  );

  // alice and bob both map to 'user', and final message is also 'user', so all merge
  assert.equal(messages.length, 1);
  assert.equal(messages[0].role, "user");
  assert.equal(
    messages[0].content,
    "alice: Message 1\nbob: Message 2\nMessage 3"
  );
});

test("buildChatMessages caps history to last 10 messages", () => {
  const adapter = new ConcreteTestAdapter();
  const history = Array.from({ length: 15 }, (_, i) => ({
    _id: String(i),
    msg: `Message ${i}`,
    u: { _id: `u${i}`, username: `user${i}` },
    ts: new Date(),
  }));

  const context = { roomId: "r1", userId: "u1", history };
  const messages = adapter.exposeBuildChatMessages(
    context,
    "Final msg",
    "",
    "assistant"
  );

  // First 5 messages (0 to 4) should be sliced off
  assert.ok(!messages[0].content.includes("user0: Message 0"));
  assert.ok(messages[0].content.includes("user5: Message 5"));
});

test("getSuggestions cleans prefixes, colons, quotes and caps at 3 suggestions", async () => {
  const adapter = new ConcreteTestAdapter(async () => ({
    text: [
      '1. "Sounds great!"',
      "bob: I will check this tomorrow",
      "• Definitely, let's proceed",
      "4. An extra suggestion that exceeds three",
    ].join("\n"),
  }));

  const conversation = [
    {
      _id: "1",
      msg: "Can we meet at 3pm?",
      u: { _id: "u2", username: "bob" },
      ts: new Date(),
    },
  ];

  const suggestions = await adapter.getSuggestions(conversation, {
    roomId: "r1",
    userId: "u1",
    history: conversation,
  });

  assert.equal(suggestions.length, 3);
  assert.equal(suggestions[0], "Sounds great!");
  assert.equal(suggestions[1], "I will check this tomorrow");
  assert.equal(suggestions[2], "Definitely, let's proceed");
});

test("getSuggestions prioritizes response.suggestions array if provided", async () => {
  const adapter = new ConcreteTestAdapter(async () => ({
    text: "Raw text ignored",
    suggestions: ['"Yes"', "• Maybe", "No problem", "Extra"],
  }));

  const suggestions = await adapter.getSuggestions([], {
    roomId: "r1",
    userId: "u1",
    history: [],
  });

  assert.deepEqual(suggestions, ["Yes", "Maybe", "No problem"]);
});

test("summarize sends formatted transcript and returns summary text", async () => {
  let promptSent = "";
  const adapter = new ConcreteTestAdapter(async (ctx, message) => {
    promptSent = message;
    return { text: "Summary of discussion: Project milestone reached." };
  });

  const messages = [
    {
      _id: "1",
      msg: "Did we finish the release?",
      u: { _id: "u1", username: "alice" },
      ts: new Date(),
    },
    {
      _id: "2",
      msg: "Yes, everything is deployed.",
      u: { _id: "u2", username: "bob" },
      ts: new Date(),
    },
  ];

  const summary = await adapter.summarize(messages, {
    roomId: "r1",
    userId: "u1",
    history: [],
  });

  assert.equal(summary, "Summary of discussion: Project milestone reached.");
  assert.ok(promptSent.includes("<transcript>"));
  assert.ok(promptSent.includes("alice: Did we finish the release?"));
  assert.ok(promptSent.includes("bob: Yes, everything is deployed."));
  assert.ok(
    promptSent.includes(
      "Summarize this conversation concisely in 3-5 sentences."
    )
  );
});
