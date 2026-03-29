/**
 * IAiAdapter Interface Definition
 * Defines the contract that any AI provider must adhere to before being plugged into EmbeddedChat.
 */

export class AiAdapter {
  /**
   * @param {string} name - The readable name of the AI service (e.g. "Gemini", "Ollama").
   */
  constructor(name) {
    this.name = name;
    this.enabled = true;
  }

  /**
   * Given the context of the room history, suggest auto-replies.
   * @param {Array<Object>} messageContext - The last N messages in the room.
   * @returns {Promise<Array<string>>} - An array of suggested replies.
   */
  async getSmartReplies(messageContext) {
    throw new Error('Not implemented');
  }

  /**
   * Summarize the current view for quick catch-up.
   * @param {Array<Object>} messages - The raw message payloads.
   * @returns {Promise<string>} - The summary text.
   */
  async getSummary(messages) {
    throw new Error('Not implemented');
  }
}
