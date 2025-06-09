import { DDPSDK } from "@rocket.chat/ddp-client";

export interface IRocketChatAuthOptions {
  host: string;
  rcClient: DDPSDK;
  saveToken: (token: string) => Promise<void>;
  getToken: () => Promise<string>;
  deleteToken: () => Promise<void>;
}
