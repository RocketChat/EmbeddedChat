// For testing/demo only — returns hardcoded responses, requires no API key
import { LayoutBlock } from "@rocket.chat/ui-kit";
import { BaseAIAdapter } from "../BaseAIAdapter";
import { AIContext, AIResponse } from "../types";

export class MockAdapter extends BaseAIAdapter {
  name = "Mock (Demo)";

  async sendPrompt(_context: AIContext, message: string): Promise<AIResponse> {
    return {
      text: `Mock response to: "${message}"`,
      suggestions: ["Sure!", "Let me check", "Can you tell me more?"],
    };
  }

  async generateUIBlocks(
    _prompt: string,
    _existingBlocks?: LayoutBlock[]
  ): Promise<{ blocks: LayoutBlock[]; componentType: string }> {
    const lowerPrompt = _prompt.toLowerCase();
    let componentType = "info";
    let blocks: any[] = [];

    if (lowerPrompt.includes("form") || lowerPrompt.includes("login")) {
      componentType = "form";
      blocks = [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Mock AI Login Form",
          },
        },
        {
          type: "input",
          element: {
            type: "plain_text_input",
            actionId: "username",
            placeholder: {
              type: "plain_text",
              text: "Enter your username",
            },
          },
          label: {
            type: "plain_text",
            text: "Username",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Login",
              },
              actionId: "login_btn",
              value: "login",
            },
          ],
        },
      ];
    } else if (lowerPrompt.includes("profile") || lowerPrompt.includes("user")) {
      componentType = "profile";
      blocks = [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*John Doe* @jdoe",
          },
          accessory: {
            type: "image",
            imageUrl: "https://picsum.photos/seed/john/400/400",
            altText: "Profile picture",
          },
        },
      ];
    } else if (lowerPrompt.includes("gallery") || lowerPrompt.includes("media") || lowerPrompt.includes("images")) {
      componentType = "gallery";
      blocks = [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Photo Gallery",
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "image",
              imageUrl: "https://picsum.photos/seed/photo1/400/400",
              altText: "Gallery image 1",
            },
            {
              type: "image",
              imageUrl: "https://picsum.photos/seed/photo2/400/400",
              altText: "Gallery image 2",
            },
          ],
        },
      ];
    } else if (lowerPrompt.includes("cta") || lowerPrompt.includes("action") || lowerPrompt.includes("button")) {
      componentType = "cta";
      blocks = [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Ready to get started?",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Sign Up Now",
              },
              actionId: "signup_btn",
              value: "signup",
            },
          ],
        },
      ];
    } else {
      componentType = "info";
      blocks = [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Mock AI Component generated successfully.",
          },
        },
      ];
    }

    return { blocks: blocks as LayoutBlock[], componentType };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}
