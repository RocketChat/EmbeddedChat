
export interface IAiAdapter {
  name: string;
  enabled: boolean;
  getSmartReplies: (messageContext: any[]) => Promise<string[]>;
  getSummary: (messages: any[]) => Promise<string>;
  onCommand: (command: string, params: any) => Promise<any>;
}
