import * as sdk from "matrix-js-sdk";
import { IChatProvider } from "./IChatProvider";
import { RocketChatAuth } from "@embeddedchat/auth";

class MatrixAuth extends RocketChatAuth {
  private onAuthChangeCb: ((user: any) => void) | null = null;
  currentUser: any | null = null;

  constructor(config: any) {
    super(config);
  }

  async onAuthChange(cb: (user: any) => void): Promise<void> {
    this.onAuthChangeCb = cb;
    if (this.currentUser) {
      cb(this.currentUser);
    }
  }

  notifyAuthChange(user: any) {
    this.currentUser = user;
    if (this.onAuthChangeCb) {
      this.onAuthChangeCb(user);
    }
  }
}

export default class MatrixProvider implements IChatProvider {
  private client: any;
  private host: string;
  private roomId: string;
  private auth: MatrixAuth;
  private onMessageCallbacks: ((message: any) => void)[] = [];

  constructor(host: string, roomId: string) {
    this.host = host;
    this.roomId = roomId;
    this.auth = new MatrixAuth({
      host: this.host,
      deleteToken: async () => {},
      getToken: async () => "",
      saveToken: async () => {},
    });
  }

  async connect(): Promise<void> {
    if (!this.client) {
      this.client = sdk.createClient({
        baseUrl: this.host,
      });
    }

    // Map Matrix events to EmbeddedChat callbacks
    this.client.removeAllListeners("Room.timeline");
    this.client.on(
      "Room.timeline",
      (event: any, room: any, toStartOfTimeline: boolean) => {
        if (
          event.getType() !== "m.room.message" &&
          event.getType() !== "m.room.encrypted"
        ) {
          return;
        }
        if (room.roomId !== this.roomId) {
          return;
        }
        const isEncrypted = event.getType() === "m.room.encrypted";
        const text = isEncrypted
          ? "⚠️ [Encrypted Message]"
          : event.getContent().body;

        // Convert Matrix event to RC message format
        const message = {
          _id: event.getId(),
          msg: text,
          md: [
            {
              type: "PARAGRAPH",
              value: [
                {
                  type: "PLAIN_TEXT",
                  value: text,
                },
              ],
            },
          ],
          ts: new Date(event.getTs()).toISOString(),
          u: {
            _id: event.getSender(),
            username: event.getSender(),
          },
          rid: room.roomId,
        };
        this.onMessageCallbacks.forEach((cb) => cb(message));
      }
    );

    if (!this.client.clientRunning) {
      await this.client.startClient({ initialSyncLimit: 10 });
    }

    await new Promise<void>((resolve) => {
      const state = this.client.getSyncState();
      if (state === "PREPARED" || state === "SYNCING") {
        resolve();
      } else {
        const checkSync = (state: any) => {
          if (state === "PREPARED" || state === "SYNCING") {
            this.client.removeListener("Sync", checkSync);
            resolve();
          }
        };
        this.client.on("Sync", checkSync);

        // Timeout after 5 seconds to prevent hanging
        setTimeout(() => {
          this.client.removeListener("Sync", checkSync);
          resolve();
        }, 5000);
      }
    });

    let room = this.client.getRoom(this.roomId);
    if (!room) {
      try {
        await this.client.joinRoom(this.roomId);

        // Wait for room to appear in store
        let retries = 0;
        while (!room && retries < 20) {
          await new Promise((r) => setTimeout(r, 1000));
          room = this.client.getRoom(this.roomId);
          retries++;
        }
      } catch (error) {
        console.error(
          `MatrixProvider: Failed to join room ${this.roomId}`,
          error
        );
      }
    }
  }

  async login(
    userOrEmail: string,
    password: string,
    code?: string
  ): Promise<any> {
    if (!this.client) {
      this.client = sdk.createClient({
        baseUrl: this.host,
      });
    }
    const response = await this.client.login("m.login.password", {
      identifier: {
        type: "m.id.user",
        user: userOrEmail,
      },
      password: password,
    });

    // Ensure we connect (start client and sync) after login
    await this.connect();

    const user = {
      username: response.user_id,
      _id: response.user_id,
      name: response.user_id,
      avatarUrl: "", // Placeholder
      roles: [],
    };

    // Notify auth change to update UI
    this.auth.notifyAuthChange({ me: user });

    return { status: "success", me: user };
  }

  async close(): Promise<void> {
    if (this.client) {
      this.client.stopClient();
    }
    this.auth.notifyAuthChange(null);
  }

  async getStarredMessages(): Promise<any> {
    return { messages: [] };
  }

  async getAllFiles(): Promise<any> {
    return { files: [] };
  }

  async getMessages(
    anonymousMode: boolean,
    options?: any,
    isChannelPrivate?: boolean
  ): Promise<any> {
    if (!this.client) return { messages: [], count: 0 };
    const room = this.client.getRoom(this.roomId);
    if (!room) {
      return { messages: [], count: 0 };
    }

    const events = room.getLiveTimeline().getEvents();

    // Reverse events to match Rocket.Chat's newest-first expectation
    const messages = events
      .slice() // Create a copy before reversing
      .reverse()
      .filter(
        (event: any) =>
          event.getType() === "m.room.message" ||
          event.getType() === "m.room.encrypted"
      )
      .map((event: any) => {
        const isEncrypted = event.getType() === "m.room.encrypted";
        const text = isEncrypted
          ? "⚠️ [Encrypted Message]"
          : event.getContent().body;
        return {
          _id: event.getId(),
          msg: text,
          md: [
            {
              type: "PARAGRAPH",
              value: [
                {
                  type: "PLAIN_TEXT",
                  value: text,
                },
              ],
            },
          ],
          ts: new Date(event.getTs()).toISOString(),
          u: {
            _id: event.getSender(),
            username: event.getSender(),
          },
          rid: room.roomId,
        };
      });

    return { messages, count: messages.length, success: true };
  }

  async channelInfo(): Promise<any> {
    if (!this.client) return {};
    const room = this.client.getRoom(this.roomId);
    if (!room) return {};
    return {
      success: true,
      room: {
        _id: room.roomId,
        name: room.name || "Matrix Room",
        t: "c",
      },
    };
  }

  async getRoomInfo(): Promise<any> {
    if (!this.client) return {};
    const room = this.client.getRoom(this.roomId);
    if (!room) return {};
    return {
      success: true,
      room: {
        _id: room.roomId,
        name: room.name,
        t: "c",
      },
    };
  }

  async sendMessage(message: any, threadId?: string): Promise<any> {
    const content = {
      msgtype: "m.text",
      body: typeof message === "string" ? message : message.msg,
    };
    const response = await this.client.sendEvent(
      this.roomId,
      "m.room.message",
      content
    );
    return { _id: response.event_id };
  }

  async getOlderMessages(
    anonymousMode: boolean,
    options?: any,
    isChannelPrivate?: boolean
  ): Promise<any> {
    return { messages: [] };
  }

  async getThreadMessages(
    tmid: string,
    isChannelPrivate?: boolean
  ): Promise<any> {
    return { messages: [] };
  }

  async deleteMessage(msgId: string): Promise<any> {
    return {};
  }

  async updateMessage(msgId: string, text: string): Promise<any> {
    return {};
  }

  async getChannelRoles(isChannelPrivate?: boolean): Promise<any> {
    return [];
  }

  async getUsersInRole(role: string): Promise<any> {
    return [];
  }

  async getUserRoles(): Promise<any> {
    return [];
  }

  async sendTypingStatus(username: string, typing: boolean): Promise<void> {
    await this.client.sendTyping(this.roomId, typing, 3000);
  }

  addMessageListener(callback: (message: any) => void): void {
    this.onMessageCallbacks.push(callback);
  }

  removeMessageListener(callback: (message: any) => void): void {
    this.onMessageCallbacks = this.onMessageCallbacks.filter(
      (c) => c !== callback
    );
  }

  addMessageDeleteListener(callback: (messageId: string) => void): void {}

  removeMessageDeleteListener(callback: (messageId: string) => void): void {}

  addTypingStatusListener(callback: (users: string[]) => void): void {}

  removeTypingStatusListener(callback: (users: string[]) => void): void {}

  addActionTriggeredListener(callback: (data: any) => void): void {}

  removeActionTriggeredListener(callback: (data: any) => void): void {}

  addUiInteractionListener(callback: (data: any) => void): void {}

  removeUiInteractionListener(callback: (data: any) => void): void {}

  async logout(): Promise<void> {
    if (this.client) {
      await this.client.logout();
    }
    this.auth.notifyAuthChange(null);
  }

  async autoLogin(auth: {
    flow: "PASSWORD" | "OAUTH" | "TOKEN";
    credentials: any;
  }): Promise<void> {}

  async googleSSOLogin(signIn: Function, acsCode: string): Promise<any> {}

  async getRCAppInfo(): Promise<any> {
    return null;
  }

  async updateUserUsername(userid: string, username: string): Promise<any> {
    return {};
  }

  async permissionInfo(): Promise<any> {
    return [];
  }

  setAuth(auth: RocketChatAuth): void {
    // We ignore external auth setting for now as we manage our own MatrixAuth
  }

  getAuth(): RocketChatAuth {
    return this.auth;
  }

  getHost(): string {
    return this.host;
  }

  async getMessageLimit(): Promise<any> {
    return { value: 5000 }; // Default limit
  }
}
