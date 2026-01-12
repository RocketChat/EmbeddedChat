import * as sdk from "matrix-js-sdk";
import { IChatProvider } from "./IChatProvider";
import { RocketChatAuth, IRocketChatAuthOptions } from "@embeddedchat/auth";

class MatrixAuth extends RocketChatAuth {
  private onAuthChangeCb: ((user: any) => void) | null = null;
  currentUser: any | null = null;

  constructor(config: IRocketChatAuthOptions) {
    super(config);
  }
}

export default class MatrixProvider implements IChatProvider {
  private client: any;
  private host: string;
  private roomId: string;
  private auth: MatrixAuth;
  private onMessageCallbacks: ((message: any) => void)[] = [];

  constructor(
    host: string,
    roomId: string,
    { getToken, saveToken, deleteToken }: IRocketChatAuthOptions
  ) {
    this.host = host;
    this.roomId = roomId;
    this.auth = new MatrixAuth({
      host: this.host,
      deleteToken,
      getToken,
      saveToken,
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
        // Ignore historical messages to prevent duplicates
        if (toStartOfTimeline) {
          return;
        }
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

        // Get display name from room member
        const senderId = event.getSender();
        const member = room.getMember(senderId);
        const displayName = member?.name || senderId;

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
            _id: senderId,
            username: displayName,
            name: displayName,
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
      if (!this.client) {
        resolve();
        return;
      }
      const state = this.client.getSyncState();
      if (state === "PREPARED" || state === "SYNCING") {
        resolve();
      } else {
        const checkSync = (state: any) => {
          if (state === "PREPARED" || state === "SYNCING") {
            if (this.client) {
              this.client.removeListener("Sync", checkSync);
            }
            resolve();
          }
        };
        this.client.on("Sync", checkSync);

        // Timeout after 5 seconds to prevent hanging
        setTimeout(() => {
          if (this.client) {
            this.client.removeListener("Sync", checkSync);
          }
          resolve();
        }, 5000);
      }
    });

    if (!this.client) {
      console.log("Matrix: client became null during sync wait");
      return;
    }

    let room = this.client.getRoom(this.roomId);
    if (!room) {
      try {
        await this.client.joinRoom(this.roomId);

        // Wait for room to appear in store
        let retries = 0;
        while (!room && retries < 20 && this.client) {
          await new Promise((r) => setTimeout(r, 1000));
          room = this.client?.getRoom(this.roomId);
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
    try {
      const credentials = code
        ? { user: userOrEmail, password, code }
        : { user: userOrEmail, password };

      const data = await this.auth.loginWithPassword(credentials);

      if (!data) {
        throw new Error("Login failed");
      }

      const { authToken, userId } = data;

      // Initialize Matrix client with RC auth token
      this.client = sdk.createClient({
        baseUrl: this.host,
        accessToken: authToken,
        userId: userId,
      });

      // Ensure we connect (start client and sync) after login
      await this.connect();

      return { status: "success", me: data };
    } catch (error: any) {
      console.error("MatrixProvider login failed:", error);
      return {
        error: "Unauthorized",
        message: error.message || "Invalid username or password",
      };
    }
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

        // Get display name from room member
        const senderId = event.getSender();
        const member = room.getMember(senderId);
        const displayName = member?.name || senderId;

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
            _id: senderId,
            username: displayName,
            name: displayName,
          },
          rid: room.roomId,
        };
      });

    return { messages, count: messages.length, success: true };
  }

  async channelInfo(): Promise<any> {
    if (!this.client) {
      return {
        success: false,
        errorType: "error-room-not-found",
        error: "Not connected to Matrix server",
      };
    }
    const room = this.client.getRoom(this.roomId);
    if (!room) {
      return {
        success: false,
        errorType: "error-room-not-found",
        error: `Room ${this.roomId} not found`,
      };
    }
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
    if (!this.client) {
      return {
        success: false,
        errorType: "error-room-not-found",
        error: "Not connected to Matrix server",
      };
    }
    const room = this.client.getRoom(this.roomId);
    if (!room) {
      return {
        success: false,
        errorType: "error-room-not-found",
        error: `Room ${this.roomId} not found`,
      };
    }
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
    try {
      const response = await this.client.sendEvent(
        this.roomId,
        "m.room.message",
        content
      );
      return { success: true, message: { _id: response.event_id } };
    } catch (error: any) {
      console.error("Matrix sendMessage failed:", error);
      return { success: false, error: error.message };
    }
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
    // Matrix message deletion not implemented
    return {
      success: false,
      error: "Message deletion not supported in Matrix mode",
    };
  }

  async updateMessage(msgId: string, text: string): Promise<any> {
    // Matrix message editing not implemented
    return {
      success: false,
      error: "Message editing not supported in Matrix mode",
    };
  }

  async starMessage(msgId: string): Promise<any> {
    // Matrix doesn't have native starring - could use room account data
    return { success: true }; // Silently succeed for now
  }

  async unstarMessage(msgId: string): Promise<any> {
    return { success: true };
  }

  async pinMessage(msgId: string): Promise<any> {
    // Matrix has m.room.pinned_events state event
    return { success: true }; // Stub for now
  }

  async unpinMessage(msgId: string): Promise<any> {
    return { success: true };
  }

  async reactToMessage(
    emoji: string,
    msgId: string,
    shouldReact: boolean
  ): Promise<any> {
    // Matrix supports reactions via m.reaction
    return { success: true }; // Stub for now
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

  addMessageDeleteListener(callback: (messageId: string) => void): void { }

  removeMessageDeleteListener(callback: (messageId: string) => void): void { }

  addTypingStatusListener(callback: (users: string[]) => void): void { }

  removeTypingStatusListener(callback: (users: string[]) => void): void { }

  addActionTriggeredListener(callback: (data: any) => void): void { }

  removeActionTriggeredListener(callback: (data: any) => void): void { }

  addUiInteractionListener(callback: (data: any) => void): void { }

  removeUiInteractionListener(callback: (data: any) => void): void { }

  async logout(): Promise<void> {
    if (this.client) {
      await this.client.logout();
    }
    this.auth.notifyAuthChange(null);
  }

  async autoLogin(auth: {
    flow: "PASSWORD" | "OAUTH" | "TOKEN";
    credentials: any;
  }): Promise<void> {
    try {
      if (!auth || !auth.flow) {
        return;
      }
      let user = null;
      switch (auth.flow) {
        case "PASSWORD":
        case "OAUTH":
          // Load stored token
          await this.auth.load();
          user = await this.auth.getCurrentUser();
          break;
        case "TOKEN":
          if (!auth.credentials) {
            return;
          }
          await this.auth.loginWithOAuthServiceToken(auth.credentials);
          user = await this.auth.getCurrentUser();
          break;
        default:
          break;
      }

      if (user && user.authToken && user.userId) {
        if (this.client) {
          this.client.stopClient();
        }
        this.client = sdk.createClient({
          baseUrl: this.host,
          accessToken: user.authToken,
          userId: user.userId,
        });
        await this.connect();
      }
    } catch (error) {
      console.error("MatrixProvider auto-login failed:", error);
    }
  }

  async googleSSOLogin(signIn: Function, acsCode: string): Promise<any> { }

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

  // Additional methods for toast compatibility
  async reportMessage(messageId: string, description: string): Promise<any> {
    // Matrix doesn't have built-in message reporting
    return {
      success: false,
      error: "Message reporting not supported in Matrix mode",
    };
  }

  async getSearchMessages(text: string): Promise<any> {
    // Matrix search would require server-side search API
    return { messages: [] };
  }

  async me(): Promise<any> {
    if (!this.client) return {};
    const userId = this.client.getUserId();
    if (!userId) return {};
    return {
      _id: userId,
      username: userId,
      name: userId,
    };
  }

  async userData(username: string): Promise<any> {
    // Matrix user profile lookup
    return { user: null };
  }

  async getUserStatus(userId: string): Promise<any> {
    // Matrix presence API
    return { status: "online" };
  }

  async findOrCreateInvite(): Promise<any> {
    // Matrix room invite link
    return { url: "", expires: new Date().toISOString() };
  }

  async getAllImages(): Promise<any> {
    return { files: [] };
  }

  async execCommand(command: {
    command: string;
    params: string;
  }): Promise<any> {
    // Matrix doesn't have slash commands in the same way
    return { success: false, error: "Commands not supported in Matrix mode" };
  }

  async getChannelMembers(isChannelPrivate?: boolean): Promise<any> {
    if (!this.client) return { members: [] };
    const room = this.client.getRoom(this.roomId);
    if (!room) return { members: [] };

    const members = room.getJoinedMembers().map((member: any) => ({
      _id: member.userId,
      username: member.name || member.userId,
      name: member.name || member.userId,
    }));
    return { members };
  }

  async getCommandsList(): Promise<any> {
    return { commands: [] };
  }
}
