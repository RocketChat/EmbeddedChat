import { LayoutBlock } from "@rocket.chat/ui-kit";
import {
  UI_KIT_JSON_SCHEMA,
  validateGeneratedUiBlocks,
} from "@embeddedchat/ui-kit/generated-ui.mjs";

export { UI_KIT_JSON_SCHEMA };

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

export interface UIBlocksAndType {
  blocks: LayoutBlock[];
  componentType: string;
}

export function validateAndExtractBlocks(text: string): UIBlocksAndType {
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (e: any) {
    throw new Error(`Failed to parse AI layout response: ${e.message}`);
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

  const { valid, errors } = validateGeneratedUiBlocks(parsed);
  if (!valid) {
    const errorText = errors.join(" ");
    throw new Error(
      `AI layout response schema validation failed: ${errorText}`
    );
  }

  return {
    blocks: parsed.blocks,
    componentType: parsed.componentType || "info",
  };
}
