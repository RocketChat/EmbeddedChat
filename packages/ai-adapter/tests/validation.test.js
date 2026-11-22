import test from "node:test";
import assert from "node:assert/strict";
import {
  validateAndExtractBlocks,
  UI_KIT_GENERATION_SYSTEM_PROMPT,
  UI_KIT_JSON_SCHEMA,
} from "../dist/index.mjs";

test("exports UI_KIT_GENERATION_SYSTEM_PROMPT and UI_KIT_JSON_SCHEMA", () => {
  assert.ok(typeof UI_KIT_GENERATION_SYSTEM_PROMPT === "string");
  assert.ok(UI_KIT_GENERATION_SYSTEM_PROMPT.includes("Rocket.Chat UI-Kit"));
  assert.ok(
    typeof UI_KIT_JSON_SCHEMA === "object" && UI_KIT_JSON_SCHEMA !== null
  );
  assert.equal(UI_KIT_JSON_SCHEMA.type, "object");
});

test("validateAndExtractBlocks parses valid UI blocks and componentType", () => {
  const payload = JSON.stringify({
    componentType: "form",
    blocks: [
      {
        type: "section",
        text: { type: "plain_text", text: "Welcome" },
        accessory: null,
      },
      {
        type: "input",
        element: {
          type: "plain_text_input",
          actionId: "email",
          placeholder: { type: "plain_text", text: "Enter email" },
        },
        label: { type: "plain_text", text: "Email" },
      },
    ],
  });

  const extracted = validateAndExtractBlocks(payload);
  assert.equal(extracted.componentType, "form");
  assert.equal(extracted.blocks.length, 2);
  assert.equal(extracted.blocks[0].type, "section");
  assert.equal(extracted.blocks[1].type, "input");
});

test("validateAndExtractBlocks unpacks stringified block items within blocks array", () => {
  const stringifiedBlock = JSON.stringify({
    type: "section",
    text: { type: "plain_text", text: "Unpacked item" },
    accessory: null,
  });

  const payload = JSON.stringify({
    componentType: "info",
    blocks: [stringifiedBlock],
  });

  const extracted = validateAndExtractBlocks(payload);
  assert.equal(extracted.blocks.length, 1);
  assert.equal(extracted.blocks[0].type, "section");
  assert.equal(extracted.blocks[0].text.text, "Unpacked item");
});

test("validateAndExtractBlocks requires componentType per schema", () => {
  const payload = JSON.stringify({
    blocks: [
      {
        type: "section",
        text: { type: "plain_text", text: "Simple section" },
        accessory: null,
      },
    ],
  });

  assert.throws(
    () => {
      validateAndExtractBlocks(payload);
    },
    (err) => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes("$.componentType is required"));
      return true;
    }
  );
});

test("validateAndExtractBlocks throws descriptive error for malformed JSON", () => {
  assert.throws(
    () => {
      validateAndExtractBlocks("{ invalid json payload");
    },
    (err) => {
      assert.ok(err instanceof Error);
      assert.ok(err.message.includes("Failed to parse AI layout response"));
      return true;
    }
  );
});

test("validateAndExtractBlocks throws validation error when schema is violated", () => {
  const invalidPayload = JSON.stringify({
    componentType: "form",
    blocks: [
      {
        type: "non_existent_block_type",
        foo: "bar",
      },
    ],
  });

  assert.throws(
    () => {
      validateAndExtractBlocks(invalidPayload);
    },
    (err) => {
      assert.ok(err instanceof Error);
      assert.ok(
        err.message.includes("AI layout response schema validation failed")
      );
      return true;
    }
  );
});
