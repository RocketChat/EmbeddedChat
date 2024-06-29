import { Rocketchat } from "@rocket.chat/sdk";
import cloneArray from "./cloneArray";
import { ROCKETCHAT_APP_ID } from "./utils/constants";
import {
  IRocketChatAuthOptions,
  RocketChatAuth,
  ApiError,
} from "@embeddedchat/auth";

// mutliple typing status can come at the same time they should be processed in order.
let typingHandlerLock = 0;
export default class EmbeddedChatApi {
  host: string;
  rid: string;
  rcClient: Rocketchat;
  onMessageCallbacks: ((message: any) => void)[];
  onMessageDeleteCallbacks: ((messageId: string) => void)[];
  onTypingStatusCallbacks: ((users: string[]) => void)[];
  onActionTriggeredCallbacks: ((data: any) => void)[];
  onUiInteractionCallbacks: ((data: any) => void)[];
  typingUsers: string[];
  auth: RocketChatAuth;

  constructor(
    host: string,
    rid: string,
    { getToken, saveToken, deleteToken }: IRocketChatAuthOptions
  ) {
    this.host = host;
    this.rid = rid;
    this.rcClient = new Rocketchat({
      protocol: "ddp",
      host: this.host,
      useSsl: !/http:\/\//.test(host),
      reopen: 20000,
    });
    this.onMessageCallbacks = [];
    this.onMessageDeleteCallbacks = [];
    this.onTypingStatusCallbacks = [];
    this.typingUsers = [];
    this.onActionTriggeredCallbacks = [];
    this.onUiInteractionCallbacks = [];
    this.auth = new RocketChatAuth({
      host: this.host,
      deleteToken,
      getToken,
      saveToken,
    });
  }

  setAuth(auth: RocketChatAuth) {
    this.auth = auth;
  }

  getAuth() {
    return this.auth;
  }

  getHost() {
    return this.host;
  }

  /**
   * Todo refactor
   */
  async googleSSOLogin(signIn: Function, acsCode: string) {
    const tokens = await signIn();
    let acsPayload = null;

    if (typeof acsCode === "string") {
      acsPayload = acsCode;
    }

    const payload = acsCode
      ? JSON.stringify({
          serviceName: "google",
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          expiresIn: 3600,
          totp: {
            code: acsPayload,
          },
        })
      : JSON.stringify({
          serviceName: "google",
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          expiresIn: 3600,
          scope: "profile",
        });

    try {
      const req = await fetch(`${this.host}/api/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });
      const response = await req.json();

      if (response.status === "success") {
        if (!response.data.me.username) {
          await this.updateUserUsername(
            response.data.userId,
            response.data.me.name
          );
        }
        return { status: response.status, me: response.data.me };
      }

      if (response.error === "totp-required") {
        return response;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async login(userOrEmail: string, password: string, code: string) {
    let credentials;
    if (!code) {
      credentials = credentials = {
        user: userOrEmail,
        password,
      };
    } else {
      credentials = {
        user: userOrEmail,
        password,
        code,
      };
    }
    try {
      const data = await this.auth.loginWithPassword(credentials);
      if (!data.me.username) {
        await this.updateUserUsername(data.userId, data.me.name);
      }
      return { status: "success", me: data.me };
    } catch (error) {
      if (error instanceof ApiError && error.response?.status === 401) {
        const authErrorRes = await error.response.json();
        return { error: authErrorRes?.error };
      }
      console.error(error);
    }
  }

  async autoLogin(auth: {
    flow: "PASSWORD" | "OAUTH" | "TOKEN";
    credentials: any;
  }) {
    try {
      if (!auth || !auth.flow) {
        return;
      }
      switch (auth.flow) {
        case "PASSWORD":
        case "OAUTH":
          await this.auth.load();
          break;
        case "TOKEN":
          if (!auth.credentials) {
            return;
          }
          await this.auth.loginWithOAuthServiceToken(auth.credentials);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Auto-login failed:", error);
    }
  }

  async logout() {
    try {
      await this.auth.logout();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * All subscriptions are implemented here.
   * TODO: Add logic to call thread message event listeners. To be done after thread implementation
   */
  async connect() {
    try {
      await this.close(); // before connection, all previous subscriptions should be cancelled
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
          console.log(message.ts?.$date);
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

  async addMessageListener(callback: (message: any) => void) {
    const idx = this.onMessageCallbacks.findIndex((c) => c === callback);
    if (idx !== -1) {
      this.onMessageCallbacks[idx] = callback;
    } else {
      this.onMessageCallbacks.push(callback);
    }
  }

  async removeMessageListener(callback: (message: any) => void) {
    this.onMessageCallbacks = this.onMessageCallbacks.filter(
      (c) => c !== callback
    );
  }

  async addMessageDeleteListener(callback: (messageId: string) => void) {
    const idx = this.onMessageDeleteCallbacks.findIndex((c) => c === callback);
    if (idx !== -1) {
      this.onMessageDeleteCallbacks[idx] = callback;
    } else {
      this.onMessageDeleteCallbacks.push(callback);
    }
  }

  async removeMessageDeleteListener(callback: (messageId: string) => void) {
    this.onMessageDeleteCallbacks = this.onMessageDeleteCallbacks.filter(
      (c) => c !== callback
    );
  }

  async addTypingStatusListener(callback: (users: string[]) => void) {
    const idx = this.onTypingStatusCallbacks.findIndex((c) => c === callback);
    if (idx !== -1) {
      this.onTypingStatusCallbacks[idx] = callback;
    } else {
      this.onTypingStatusCallbacks.push(callback);
    }
  }

  async removeTypingStatusListener(callback: (users: string[]) => void) {
    this.onTypingStatusCallbacks = this.onTypingStatusCallbacks.filter(
      (c) => c !== callback
    );
  }

  async addActionTriggeredListener(callback: (data: any) => void) {
    const idx = this.onActionTriggeredCallbacks.findIndex(
      (c) => c === callback
    );
    if (idx !== -1) {
      this.onActionTriggeredCallbacks[idx] = callback;
    } else {
      this.onActionTriggeredCallbacks.push(callback);
    }
  }

  async removeActionTriggeredListener(callback: (data: any) => void) {
    this.onActionTriggeredCallbacks = this.onActionTriggeredCallbacks.filter(
      (c) => c !== callback
    );
  }

  async addUiInteractionListener(callback: (data: any) => void) {
    const idx = this.onUiInteractionCallbacks.findIndex((c) => c === callback);
    if (idx !== -1) {
      this.onUiInteractionCallbacks[idx] = callback;
    } else {
      this.onUiInteractionCallbacks.push(callback);
    }
  }

  async removeUiInteractionListener(callback: (data: any) => void) {
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
    // don't wait for more than 2 seconds. Though in practical, the waiting time is insignificant.
    setTimeout(() => {
      typingHandlerLock = 0;
    }, 2000);
    // eslint-disable-next-line no-empty
    while (typingHandlerLock) {}
    typingHandlerLock = 1;
    // move user to front if typing else remove it.
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

  async getRCAppInfo() {
    try {
      const response = await fetch(
        `${this.host}/api/apps/public/${ROCKETCHAT_APP_ID}/info`
      );

      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async updateUserNameThroughSuggestion(userid: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/users.getUsernameSuggestion`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );

      const suggestedUsername = await response.json();

      if (suggestedUsername.success) {
        const response2 = await fetch(`${this.host}/api/v1/users.update`, {
          body: `{"userId": "${userid}", "data": { "username": "${suggestedUsername.result}" }}`,
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "POST",
        });

        return await response2.json();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async updateUserUsername(userid: string, username: string) {
    const newUserName = username.replace(/\s/g, ".").toLowerCase();

    const usernameRegExp = /[0-9a-zA-Z-_.]+/;

    if (usernameRegExp.test(newUserName)) {
      try {
        const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
        const response = await fetch(`${this.host}/api/v1/users.update`, {
          body: `{"userId": "${userid}", "data": { "username": "${newUserName}" }}`,
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "POST",
        });

        const result = await response.json();

        if (
          !result.success &&
          result.errorType === "error-could-not-save-identity"
        ) {
          return await this.updateUserNameThroughSuggestion(userid);
        }
        return result;
      } catch (err) {
        console.error(err);
      }
    } else {
      return this.updateUserNameThroughSuggestion(userid);
    }
  }

  async channelInfo() {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/rooms.info?roomId=${this.rid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async permissionInfo() {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/permissions.listAll`, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "GET",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async close() {
    await this.rcClient.unsubscribeAll();
    await this.rcClient.disconnect();
  }

  /**
   * @param {boolean} anonymousMode
   * @param {Object} options This object should include query or fields.
   * query - json object which accepts MongoDB query operators.
   * fields - json object with properties that have either 1 or 0 to include them or exclude them
   * @returns messages
   */
  async getMessages(
    anonymousMode = false,
    options: {
      query?: object | undefined;
      field?: object | undefined;
    } = {
      query: undefined,
      field: undefined,
    },
    isChannelPrivate = false
  ) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    const endp = anonymousMode ? "anonymousread" : "messages";
    const query = options?.query
      ? `&query=${JSON.stringify(options.query)}`
      : "";
    const field = options?.field
      ? `&field=${JSON.stringify(options.field)}`
      : "";
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const messages = await fetch(
        `${this.host}/api/v1/${roomType}.${endp}?roomId=${this.rid}${query}${field}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await messages.json();
    } catch (err) {
      console.log(err);
    }
  }

  async getThreadMessages(tmid: string, isChannelPrivate = false) {
    return this.getMessages(
      false,
      {
        query: {
          tmid,
        },
      },
      isChannelPrivate
    );
  }

  async getChannelRoles(isChannelPrivate = false) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const roles = await fetch(
        `${this.host}/api/v1/${roomType}.roles?roomId=${this.rid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await roles.json();
    } catch (err) {
      console.log(err);
    }
  }

  async getUsersInRole(role: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const roles = await fetch(
        `${this.host}/api/v1/roles.getUsersInRole?role=${role}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await roles.json();
    } catch (err) {
      console.log(err);
    }
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

  /**
   * @param {*} message should be a string or an rc message object
   * Refer https://developer.rocket.chat/reference/api/schema-definition/message#message-object
   */
  async sendMessage(message: any, threadId: string) {
    const messageObj =
      typeof message === "string"
        ? {
            rid: this.rid,
            msg: message,
          }
        : {
            ...message,
            rid: this.rid,
          };
    if (threadId) {
      messageObj.tmid = threadId;
    }
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/chat.sendMessage`, {
        body: JSON.stringify({ message: messageObj }),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async deleteMessage(msgId: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/chat.delete`, {
        body: `{"roomId": "${this.rid}", "msgId": "${msgId}","asUser" : true }`,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async updateMessage(msgId: string, text: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/chat.update`, {
        body: `{"roomId": "${this.rid}", "msgId": "${msgId}","text" : "${text}" }`,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getAllFiles(isChannelPrivate = false) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/${roomType}.files?roomId=${this.rid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getAllImages() {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/channels.images?roomId=${this.rid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async starMessage(mid: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/chat.starMessage`, {
        body: `{"messageId": "${mid}"}`,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async unstarMessage(mid: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/chat.unStarMessage`, {
        body: `{"messageId": "${mid}"}`,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getStarredMessages() {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/chat.getStarredMessages?roomId=${this.rid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getPinnedMessages() {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/chat.getPinnedMessages?roomId=${this.rid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getMentionedMessages() {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/chat.getMentionedMessages?roomId=${this.rid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async pinMessage(mid: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/chat.pinMessage`, {
        body: `{"messageId": "${mid}"}`,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      return {
        error: err,
      };
    }
  }

  async unpinMessage(mid: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/chat.unPinMessage`, {
        body: `{"messageId": "${mid}"}`,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async reactToMessage(emoji: string, messageId: string, shouldReact: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/chat.react`, {
        body: `{"messageId": "${messageId}", "emoji": "${emoji}", "shouldReact": ${shouldReact}}`,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async reportMessage(messageId: string, description: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/chat.reportMessage`, {
        body: `{"messageId": "${messageId}", "description": "${description}"}`,
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "POST",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async findOrCreateInvite() {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/findOrCreateInvite`, {
        method: "POST",
        body: JSON.stringify({ rid: this.rid, days: 1, maxUses: 10 }),
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
      });
      return await response.json();
    } catch (err) {
      console.log(err);
    }
  }

  async sendAttachment(
    file: File,
    fileName: string,
    fileDescription = "",
    threadId = undefined
  ) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const form = new FormData();
      if (threadId) {
        form.append("tmid", threadId);
      }
      form.append("file", file, fileName);
      form.append(
        "description",
        fileDescription.length !== 0 ? fileDescription : ""
      );
      const response = fetch(`${this.host}/api/v1/rooms.upload/${this.rid}`, {
        method: "POST",
        body: form,
        headers: {
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
      }).then((r) => r.json());
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  async me() {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(`${this.host}/api/v1/me`, {
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
        method: "GET",
      });
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getChannelMembers(isChannelPrivate = false) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/${roomType}.members?roomId=${this.rid}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getSearchMessages(text: string) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/chat.search?roomId=${this.rid}&searchText=${text}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async getMessageLimit() {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/settings/Message_MaxAllowedSize`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          method: "GET",
        }
      );
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async handleUiKitInteraction(appId: string, userInteraction: any) {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};

      const triggerId = Math.random().toString(32).slice(2, 16);

      const response = await fetch(
        `${this.host}/api/apps/ui.interaction/${appId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
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

  async getCommandsList() {
    const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
    const response = await fetch(`${this.host}/api/v1/commands.list`, {
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": authToken,
        "X-User-Id": userId,
      },
      method: "GET",
    });
    const data = await response.json();
    return data;
  }

  async execCommand({ command, params }: { command: string; params: string }) {
    const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
    const response = await fetch(`${this.host}/api/v1/commands.run`, {
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": authToken,
        "X-User-Id": userId,
      },
      method: "POST",
      body: JSON.stringify({
        command,
        params,
        roomId: this.rid,
        triggerId: Math.random().toString(32).slice(2, 20),
      }),
    });
    const data = await response.json();
    return data;
  }

  async getUserStatus(reqUserId: string) {
    const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
    const response = await fetch(
      `${this.host}/api/v1/users.getStatus?userId=${reqUserId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
      }
    );
    const data = response.json();
    return data;
  }

  async userInfo(reqUserId: string) {
    const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
    const response = await fetch(
      `${this.host}/api/v1/users.info?userId=${reqUserId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Auth-Token": authToken,
          "X-User-Id": userId,
        },
      }
    );
    const data = response.json();
    return data;
  }
}
