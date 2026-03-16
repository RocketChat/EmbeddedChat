import cloneArray from "../cloneArray";
import { BaseService } from "./BaseService";

let typingHandlerLock = 0;

export class RealtimeService extends BaseService {
  private onMessageCallbacks: ((message: any) => void)[] = [];
  private onMessageDeleteCallbacks: ((messageId: string) => void)[] = [];
  private onTypingStatusCallbacks: ((users: string[]) => void)[] = [];
  private onActionTriggeredCallbacks: ((data: any) => void)[] = [];
  private onUiInteractionCallbacks: ((data: any) => void)[] = [];
  private typingUsers: string[] = [];

  async connect() {
    try {
      await this.close();
      await this.rcClient.connect({});
      const token = (await this.auth.getCurrentUser())?.authToken;
      await this.rcClient.resume({ token });
      await this.rcClient.subscribeRoom(this.rid);
      await this.rcClient.onMessage((data: any) => {
        if (!data) {
          return;
        }
        const message = JSON.parse(JSON.stringify(data));
        if (message.ts?.$date) {
          message.ts = message.ts.$date;
        }
        if (!message.ts) {
          message.ts = new Date().toISOString();
        }
        this.onMessageCallbacks.map((callback) => callback(message));
      });
      await this.rcClient.subscribe(
        "stream-notify-room",
        `${this.rid}/user-activity`
      );
      await this.rcClient.onStreamData(
        "stream-notify-room",
        (ddpMessage: any) => {
          const [roomId, event] = ddpMessage.fields.eventName.split("/");

          if (roomId !== this.rid) {
            return;
          }

          if (event === "user-activity") {
            const typingUser = ddpMessage.fields.args[0];
            const isTyping = ddpMessage.fields.args[1]?.includes("user-typing");
            this.handleTypingEvent({ typingUser, isTyping });
          }

          if (event === "typing") {
            const typingUser = ddpMessage.fields.args[0];
            const isTyping = ddpMessage.fields.args[1];
            this.handleTypingEvent({ typingUser, isTyping });
          }
          if (event === "deleteMessage") {
            const messageId = ddpMessage.fields.args[0]?._id;
            this.onMessageDeleteCallbacks.map((callback) =>
              callback(messageId)
            );
          }
        }
      );
      await this.rcClient.subscribeNotifyUser();
      await this.rcClient.onStreamData(
        "stream-notify-user",
        (ddpMessage: any) => {
          const [, event] = ddpMessage.fields.eventName.split("/");
          const args: any[] = ddpMessage.fields.args
            ? Array.isArray(ddpMessage.fields.args)
              ? ddpMessage.fields.args
              : [ddpMessage.fields.args]
            : [];
          if (event === "message") {
            const data = args[0];
            if (!data || data?.rid !== this.rid) {
              return;
            }
            const message = JSON.parse(JSON.stringify(data));
            if (message.ts?.$date) {
              message.ts = message.ts.$date;
            }
            if (!message.ts) {
              message.ts = new Date().toISOString();
            }
            message.renderType = "blocks";
            this.onMessageCallbacks.map((callback) => callback(message));
          } else if (event === "uiInteraction") {
            this.onUiInteractionCallbacks.forEach((callback) =>
              callback(args[0])
            );
          }
        }
      );
    } catch (err) {
      await this.close();
    }
  }

  async close() {
    await this.rcClient.unsubscribeAll();
    await this.rcClient.disconnect();
  }

  addMessageListener(callback: (message: any) => void) {
    const idx = this.onMessageCallbacks.findIndex((c) => c === callback);
    if (idx !== -1) {
      this.onMessageCallbacks[idx] = callback;
    } else {
      this.onMessageCallbacks.push(callback);
    }
  }

  removeMessageListener(callback: (message: any) => void) {
    this.onMessageCallbacks = this.onMessageCallbacks.filter(
      (c) => c !== callback
    );
  }

  addMessageDeleteListener(callback: (messageId: string) => void) {
    const idx = this.onMessageDeleteCallbacks.findIndex((c) => c === callback);
    if (idx !== -1) {
      this.onMessageDeleteCallbacks[idx] = callback;
    } else {
      this.onMessageDeleteCallbacks.push(callback);
    }
  }

  removeMessageDeleteListener(callback: (messageId: string) => void) {
    this.onMessageDeleteCallbacks = this.onMessageDeleteCallbacks.filter(
      (c) => c !== callback
    );
  }

  addTypingStatusListener(callback: (users: string[]) => void) {
    const idx = this.onTypingStatusCallbacks.findIndex((c) => c === callback);
    if (idx !== -1) {
      this.onTypingStatusCallbacks[idx] = callback;
    } else {
      this.onTypingStatusCallbacks.push(callback);
    }
  }

  removeTypingStatusListener(callback: (users: string[]) => void) {
    this.onTypingStatusCallbacks = this.onTypingStatusCallbacks.filter(
      (c) => c !== callback
    );
  }

  addActionTriggeredListener(callback: (data: any) => void) {
    const idx = this.onActionTriggeredCallbacks.findIndex(
      (c) => c === callback
    );
    if (idx !== -1) {
      this.onActionTriggeredCallbacks[idx] = callback;
    } else {
      this.onActionTriggeredCallbacks.push(callback);
    }
  }

  removeActionTriggeredListener(callback: (data: any) => void) {
    this.onActionTriggeredCallbacks = this.onActionTriggeredCallbacks.filter(
      (c) => c !== callback
    );
  }

  addUiInteractionListener(callback: (data: any) => void) {
    const idx = this.onUiInteractionCallbacks.findIndex((c) => c === callback);
    if (idx !== -1) {
      this.onUiInteractionCallbacks[idx] = callback;
    } else {
      this.onUiInteractionCallbacks.push(callback);
    }
  }

  removeUiInteractionListener(callback: (data: any) => void) {
    this.onUiInteractionCallbacks = this.onUiInteractionCallbacks.filter(
      (c) => c !== callback
    );
  }

  handleTypingEvent({
    typingUser,
    isTyping,
  }: {
    typingUser: string;
    isTyping: boolean;
  }) {
    setTimeout(() => {
      typingHandlerLock = 0;
    }, 2000);
    while (typingHandlerLock) {}
    typingHandlerLock = 1;
    const idx = this.typingUsers.indexOf(typingUser);
    if (idx !== -1) {
      this.typingUsers.splice(idx, 1);
    }
    if (isTyping) {
      this.typingUsers.unshift(typingUser);
    }
    typingHandlerLock = 0;
    const newTypingStatus = cloneArray(this.typingUsers);
    this.onTypingStatusCallbacks.forEach((callback) =>
      callback(newTypingStatus)
    );
  }

  async sendTypingStatus(username: string, typing: boolean) {
    try {
      this.rcClient.methodCall(
        "stream-notify-room",
        `${this.rid}/user-activity`,
        username,
        typing ? ["user-typing"] : []
      );
    } catch (err) {
      console.error(err);
    }
  }

  async handleUiKitInteraction(appId: string, userInteraction: any) {
    try {
      const headers = await this.getAuthHeaders();

      const triggerId = Math.random().toString(32).slice(2, 16);

      const response = await fetch(
        `${this.host}/api/apps/ui.interaction/${appId}`,
        {
          headers,
          method: "POST",
          body: JSON.stringify({
            triggerId,
            ...userInteraction,
          }),
        }
      );

      const interaction = await response.json();
      this.onActionTriggeredCallbacks.forEach((cb) => cb(interaction));
      return interaction;
    } catch (e) {
      console.error(e);
    }
  }
}
