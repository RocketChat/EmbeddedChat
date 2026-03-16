import { RocketChatAuth } from "@embeddedchat/auth";
import { Rocketchat } from "@rocket.chat/sdk";

export abstract class BaseService {
  constructor(
    protected host: string,
    protected rid: string,
    protected auth: RocketChatAuth,
    protected rcClient: Rocketchat
  ) {}

  protected async getAuthHeaders() {
    const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
    return {
      "Content-Type": "application/json",
      "X-Auth-Token": authToken || "",
      "X-User-Id": userId || "",
    };
  }
}
