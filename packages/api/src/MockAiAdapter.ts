
import { IAiAdapter } from "./IAiAdapter";

export class MockAiAdapter implements IAiAdapter {
  name = "Mock AI Adapter";
  enabled = true;

  async getSmartReplies(messageContext: any[]): Promise<string[]> {
    console.log("Mock AI: Getting smart replies for", messageContext.length, "messages");
    return ["Hello!", "How can I help you?", "I am an AI.", "Rocket.Chat is awesome!"];
  }

  async getSummary(messages: any[]): Promise<string> {
    console.log("Mock AI: Summarizing", messages.length, "messages");
    return "This is a mock summary of the conversation.";
  }

  async translateMessage(text: string, targetLanguage: string): Promise<string> {
    console.log("Mock AI: Translating text to", targetLanguage);
    return `[Translated to ${targetLanguage}]: ${text}`;
  }

  async onCommand(command: string, params: any): Promise<any> {
    console.log("Mock AI: Handling command", command, "with params", params);
    if (command === "help") {
      return "Available commands: help, hello, summarize";
    }
    return `Unknown command: ${command}`;
  }
}
