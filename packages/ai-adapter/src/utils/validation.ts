import { LayoutBlock } from "@rocket.chat/ui-kit";
import Ajv from "ajv";

export const UI_KIT_GENERATION_SYSTEM_PROMPT = `You are a Rocket.Chat UI-Kit Block generator.
Your goal is to generate or modify a list of UI-Kit layout blocks (JSON) according to the user's instructions.
You must return a JSON object with two root keys:
1. "blocks": an array of layout blocks. Each block in the array must be a direct JSON object, NOT a JSON-encoded string.
2. "componentType": a string from the enum ["form", "profile", "gallery", "cta", "info"] representing the category of the generated component.

Allowed block types:
1. "section": for displaying text with an optional accessory (like a button or image).
2. "actions": for holding interactive elements (like buttons).
3. "input": for forms (labels with plain_text_input element).
4. "divider": simple horizontal rule.
5. "image": block containing an image.
6. "context": small text/image elements for metadata.

Use a section's 'accessory' field only when a button or image is directly attached to that specific line of text. For standalone action buttons, always use a separate top-level 'actions' block.

Every 'section' block must include an explicit 'accessory' field — set it to null if there is no button or image accessory. Every 'plain_text_input' element must include an explicit 'placeholder' field — set it to null if no placeholder is needed.

When using 'mrkdwn' type text, only use Slack-style markdown syntax (*bold*, _italic_, ~strikethrough~, \`code\`) — do not use standard Markdown headings.

Field naming is camelCase throughout. For image elements and blocks use 'imageUrl' and 'altText'. For buttons and inputs use 'actionId'.

When an image needs a placeholder photo, use https://picsum.photos/seed/{unique-word}/400/400 with a unique seed per image.

If asked for something with no direct schema match, represent it using the closest available primitive. Never attempt a block type not explicitly listed above.

If existingBlocks is provided, update, add to, or modify that list based on the prompt.`;

export const UI_KIT_JSON_SCHEMA = {
  type: "object",
  properties: {
    componentType: {
      type: "string",
      enum: ["form", "profile", "gallery", "cta", "info"],
    },
    blocks: {
      type: "array",
      items: {
        anyOf: [
          {
            type: "object",
            properties: {
              type: { type: "string", const: "divider" },
            },
            required: ["type"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              type: { type: "string", const: "image" },
              imageUrl: { type: "string" },
              altText: { type: "string" },
            },
            required: ["type", "imageUrl", "altText"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              type: { type: "string", const: "section" },
              text: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["plain_text", "mrkdwn"] },
                  text: { type: "string" },
                },
                required: ["type", "text"],
                additionalProperties: false,
              },
              accessory: {
                anyOf: [
                  { type: "null" },
                  {
                    type: "object",
                    properties: {
                      type: { type: "string", const: "button" },
                      text: {
                        type: "object",
                        properties: {
                          type: { type: "string", const: "plain_text" },
                          text: { type: "string" },
                        },
                        required: ["type", "text"],
                        additionalProperties: false,
                      },
                      actionId: { type: "string" },
                      value: { type: "string" },
                    },
                    required: ["type", "text", "actionId", "value"],
                    additionalProperties: false,
                  },
                  {
                    type: "object",
                    properties: {
                      type: { type: "string", const: "image" },
                      imageUrl: { type: "string" },
                      altText: { type: "string" },
                    },
                    required: ["type", "imageUrl", "altText"],
                    additionalProperties: false,
                  },
                ],
              },
            },
            required: ["type", "text", "accessory"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              type: { type: "string", const: "actions" },
              elements: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string", const: "button" },
                    text: {
                      type: "object",
                      properties: {
                        type: { type: "string", const: "plain_text" },
                        text: { type: "string" },
                      },
                      required: ["type", "text"],
                      additionalProperties: false,
                    },
                    actionId: { type: "string" },
                    value: { type: "string" },
                  },
                  required: ["type", "text", "actionId", "value"],
                  additionalProperties: false,
                },
              },
            },
            required: ["type", "elements"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              type: { type: "string", const: "input" },
              element: {
                type: "object",
                properties: {
                  type: { type: "string", const: "plain_text_input" },
                  actionId: { type: "string" },
                  placeholder: {
                    anyOf: [
                      { type: "null" },
                      {
                        type: "object",
                        properties: {
                          type: { type: "string", const: "plain_text" },
                          text: { type: "string" },
                        },
                        required: ["type", "text"],
                        additionalProperties: false,
                      },
                    ],
                  },
                },
                required: ["type", "actionId", "placeholder"],
                additionalProperties: false,
              },
              label: {
                type: "object",
                properties: {
                  type: { type: "string", const: "plain_text" },
                  text: { type: "string" },
                },
                required: ["type", "text"],
                additionalProperties: false,
              },
            },
            required: ["type", "element", "label"],
            additionalProperties: false,
          },
          {
            type: "object",
            properties: {
              type: { type: "string", const: "context" },
              elements: {
                type: "array",
                items: {
                  anyOf: [
                    {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          enum: ["plain_text", "mrkdwn"],
                        },
                        text: { type: "string" },
                      },
                      required: ["type", "text"],
                      additionalProperties: false,
                    },
                    {
                      type: "object",
                      properties: {
                        type: { type: "string", const: "image" },
                        imageUrl: { type: "string" },
                        altText: { type: "string" },
                      },
                      required: ["type", "imageUrl", "altText"],
                      additionalProperties: false,
                    },
                  ],
                },
              },
            },
            required: ["type", "elements"],
            additionalProperties: false,
          },
        ],
      },
    },
  },
  required: ["blocks", "componentType"],
  additionalProperties: false,
};

const ajv = new Ajv();
const validate = ajv.compile(UI_KIT_JSON_SCHEMA);

export interface UIBlocksAndType {
  blocks: LayoutBlock[];
  componentType: string;
}

export function validateAndExtractBlocks(text: string): UIBlocksAndType {
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (e: any) {
    throw new Error(
      `Failed to parse AI layout response: ${e.message}. Response was: ${text}`
    );
  }

  if (parsed && Array.isArray(parsed.blocks)) {
    parsed.blocks = parsed.blocks.map((block: any) => {
      if (typeof block === "string") {
        try {
          return JSON.parse(block);
        } catch (_) {
          return block;
        }
      }
      return block;
    });
  }

  const valid = validate(parsed);
  if (!valid) {
    const errorText = ajv.errorsText(validate.errors);
    throw new Error(
      `AI layout response schema validation failed: ${errorText}. Response was: ${text}`
    );
  }

  return {
    blocks: parsed.blocks,
    componentType: parsed.componentType || "info",
  };
}
