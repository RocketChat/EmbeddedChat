export type RCMessage = {
  _id: string;
  msg: string;
  u: {
    _id: string;
    username: string;
    name?: string;
  };
  ts: string | number;
};

export interface IAIAdapter {
  /**
   * Given the recent message context in a room,
   * return 2-3 suggested reply strings.
   */
  suggestReply(context: RCMessage[]): Promise<string[]>;

  /**
   * Given a thread's messages, return a short human-readable summary.
   */
  summarizeThread(messages: RCMessage[]): Promise<string>;

  /**
   * Optional: check if a message should be flagged before sending.
   */
  moderateMessage?(text: string): Promise<{ flagged: boolean; reason?: string }>;
}
