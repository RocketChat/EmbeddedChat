import test from "node:test";
import assert from "node:assert/strict";
import { MockAdapter } from "../dist/index.mjs";

test("MockAdapter has correct name and reports available", async () => {
  const adapter = new MockAdapter();
  assert.equal(adapter.name, "Mock (Demo)");
  assert.equal(await adapter.isAvailable(), true);
});

test("MockAdapter sendPrompt returns mock message and suggestions", async () => {
  const adapter = new MockAdapter();
  const context = {
    roomId: "room-1",
    userId: "user-1",
    history: [],
  };

  const response = await adapter.sendPrompt(context, "Hello world");
  assert.equal(response.text, 'Mock response to: "Hello world"');
  assert.deepEqual(response.suggestions, [
    "Sure!",
    "Let me check",
    "Can you tell me more?",
  ]);
});

test("MockAdapter generateUIBlocks handles login and form prompts", async () => {
  const adapter = new MockAdapter();
  const result = await adapter.generateUIBlocks(
    "Create a login form for users"
  );

  assert.equal(result.componentType, "form");
  assert.ok(Array.isArray(result.blocks));
  assert.ok(result.blocks.some((b) => b.type === "section"));
  assert.ok(result.blocks.some((b) => b.type === "input"));
  assert.ok(result.blocks.some((b) => b.type === "actions"));
});

test("MockAdapter generateUIBlocks handles profile prompts", async () => {
  const adapter = new MockAdapter();
  const result = await adapter.generateUIBlocks("Show user profile card");

  assert.equal(result.componentType, "profile");
  assert.ok(result.blocks.some((b) => b.type === "section" && b.accessory));
});

test("MockAdapter generateUIBlocks handles gallery prompts", async () => {
  const adapter = new MockAdapter();
  const result = await adapter.generateUIBlocks("Show photo gallery");

  assert.equal(result.componentType, "gallery");
  assert.ok(result.blocks.some((b) => b.type === "context"));
});

test("MockAdapter generateUIBlocks handles CTA prompts", async () => {
  const adapter = new MockAdapter();
  const result = await adapter.generateUIBlocks(
    "Create a cta button to sign up"
  );

  assert.equal(result.componentType, "cta");
  assert.ok(result.blocks.some((b) => b.type === "actions"));
});

test("MockAdapter generateUIBlocks falls back to info for unclassified prompts", async () => {
  const adapter = new MockAdapter();
  const result = await adapter.generateUIBlocks("Tell me a general note");

  assert.equal(result.componentType, "info");
  assert.ok(result.blocks.some((b) => b.type === "section"));
});
