export interface IRocketChatAuthOptions {
  host: string;
  saveToken: (token: string) => Promise<void>;
  getToken: () => Promise<string>;
  deleteToken: () => Promise<void>;
}
