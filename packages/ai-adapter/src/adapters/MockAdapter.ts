// For testing/demo only — returns hardcoded responses, requires no API key
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

  async isAvailable(): Promise<boolean> {
    return true;
  }
}
