import { Rocketchat } from "@rocket.chat/sdk";
import type { IMessage } from "@rocket.chat/sdk/interfaces";
import cloneArray from "./cloneArray";
import { ROCKETCHAT_APP_ID } from "./utils/constants";
import {
  IRocketChatAuthOptions,
  RocketChatAuth,
  ApiError,
} from "@embeddedchat/auth";

// mutliple typing status can come at the same time they should be processed in order.
let typingHandlerLock = 0;

type DateValue = string | number | Date;
type DdpDate = { $date: DateValue };

type MessagePayload = Omit<IMessage, "ts"> & {
  rid?: string;
  ts?: DateValue | DdpDate;
  renderType?: string;
  [key: string]: unknown;
};

type UiInteractionPayload = {
  [key: string]: unknown;
};

type ActionTriggeredPayload = {
  [key: string]: unknown;
};

type StreamEventName = `${string}/${string}`;

type DdpStreamMessage = {
  fields?: {
    eventName?: StreamEventName;
    args?: unknown[] | unknown;
  };
  [key: string]: unknown;
};

type PasswordLoginCredentials = {
  user: string;
  password: string;
  code?: string;
};

type OAuthServiceTokenCredentials = {
  service?: string;
  access_token?: string;
  serviceName?: string;
  accessToken?: string;
  expiresIn?: number;
  [key: string]: string | number | boolean | undefined;
};

type ResumeTokenCredentials = {
  resume: string;
  [key: string]: unknown;
};

type TokenLoginCredentials = OAuthServiceTokenCredentials | ResumeTokenCredentials;

type AutoLoginInput = {
  flow: "PASSWORD" | "OAUTH" | "TOKEN";
  credentials?: TokenLoginCredentials;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeStreamArgs = (args: unknown[] | unknown | undefined): unknown[] => {
  if (Array.isArray(args)) {
    return args;
  }
  return args !== undefined ? [args] : [];
};

const normalizeMessagePayload = (value: unknown): MessagePayload | null => {
  if (!isRecord(value)) {
    return null;
  }
  const message = JSON.parse(JSON.stringify(value)) as MessagePayload;
  const tsValue = message.ts;
  if (isRecord(tsValue) && "$date" in tsValue) {
    const dateValue = tsValue.$date;
    if (
      typeof dateValue === "string" ||
      typeof dateValue === "number" ||
      dateValue instanceof Date
    ) {
      message.ts = dateValue;
    }
  }
  if (!message.ts) {
    message.ts = new Date().toISOString();
  }
  return message;
};

const normalizeTokenCredentials = (
  credentials: TokenLoginCredentials
): { [key: string]: string; service: string; access_token: string } | null => {
  if ("resume" in credentials) {
    return null;
  }

  const service = credentials.service ?? credentials.serviceName;
  const accessToken = credentials.access_token ?? credentials.accessToken;

  if (!service || !accessToken) {
    return null;
  }

  return {
    ...Object.entries(credentials).reduce<{ [key: string]: string }>(
      (acc, [key, value]) => {
        if (typeof value === "string") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    ),
    service,
    access_token: accessToken,
  };
};

export default class EmbeddedChatApi {
  host: string;
  rid: string;
  rcClient: Rocketchat;
  onMessageCallbacks: ((message: MessagePayload) => void)[];
  onMessageDeleteCallbacks: ((messageId: string) => void)[];
  onTypingStatusCallbacks: ((users: string[]) => void)[];
  onActionTriggeredCallbacks: ((data: ActionTriggeredPayload) => void)[];
  onUiInteractionCallbacks: ((data: UiInteractionPayload) => void)[];
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
        user: userOrEmail.trim(),
        password,
      };
    } else {
      credentials = {
        user: userOrEmail.trim(),
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

  async autoLogin(auth: AutoLoginInput) {
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
          const tokenCredentials = normalizeTokenCredentials(auth.credentials);
          if (!tokenCredentials) {
            return;
          }
          await this.auth.loginWithOAuthServiceToken(tokenCredentials);
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
      await this.rcClient.onMessage((data: unknown) => {
        const message = normalizeMessagePayload(data);
        if (!message) {
          return;
        }
        this.onMessageCallbacks.map((callback) => callback(message));
      });
      await this.rcClient.subscribe(
        "stream-notify-room",
        `${this.rid}/user-activity`
      );
      await this.rcClient.onStreamData(
        "stream-notify-room",
        (_error: unknown, ddpMessage: DdpStreamMessage) => {
          const eventName = ddpMessage.fields?.eventName;
          if (!eventName) {
            return;
          }
          const [roomId, event] = eventName.split("/");
          const args = normalizeStreamArgs(ddpMessage.fields?.args);

          if (roomId !== this.rid) {
            return;
          }

          if (event === "user-activity") {
            const typingUser = args[0];
            const typingStates = args[1];
            const isTyping =
              Array.isArray(typingStates) &&
              typingStates.some((state) => state === "user-typing");
            if (typeof typingUser === "string") {
              this.handleTypingEvent({ typingUser, isTyping });
            }
          }

          if (event === "typing") {
            const typingUser = args[0];
            const isTyping = args[1];
            if (typeof typingUser === "string" && typeof isTyping === "boolean") {
              this.handleTypingEvent({ typingUser, isTyping });
            }
          }
          if (event === "deleteMessage") {
            const firstArg = args[0];
            const messageId =
              isRecord(firstArg) && typeof firstArg._id === "string"
                ? firstArg._id
                : null;
            if (messageId) {
              this.onMessageDeleteCallbacks.map((callback) => callback(messageId));
            }
          }
        }
      );
      await this.rcClient.subscribeNotifyUser();
      await this.rcClient.onStreamData(
        "stream-notify-user",
        (_error: unknown, ddpMessage: DdpStreamMessage) => {
          const eventName = ddpMessage.fields?.eventName;
          if (!eventName) {
            return;
          }
          const [, event] = eventName.split("/");
          const args = normalizeStreamArgs(ddpMessage.fields?.args);
          if (event === "message") {
            const data = args[0];
            if (!isRecord(data) || data.rid !== this.rid) {
              return;
            }
            const message = normalizeMessagePayload(data);
            if (!message) {
              return;
            }
            message.renderType = "blocks";
            this.onMessageCallbacks.map((callback) => callback(message));
          } else if (event === "uiInteraction") {
            const uiInteractionData = args[0];
            if (isRecord(uiInteractionData)) {
              this.onUiInteractionCallbacks.forEach((callback) =>
                callback(uiInteractionData)
              );
            }
          }
        }
      );
    } catch (err) {
      await this.close();
    }
  }

  async addMessageListener(callback: (message: MessagePayload) => void) {
    const idx = this.onMessageCallbacks.findIndex((c) => c === callback);
    if (idx !== -1) {
      this.onMessageCallbacks[idx] = callback;
    } else {
      this.onMessageCallbacks.push(callback);
    }
  }

  async removeMessageListener(callback: (message: MessagePayload) => void) {
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

  async addActionTriggeredListener(
    callback: (data: ActionTriggeredPayload) => void
  ) {
    const idx = this.onActionTriggeredCallbacks.findIndex(
      (c) => c === callback
    );
    if (idx !== -1) {
      this.onActionTriggeredCallbacks[idx] = callback;
    } else {
      this.onActionTriggeredCallbacks.push(callback);
    }
  }

  async removeActionTriggeredListener(
    callback: (data: ActionTriggeredPayload) => void
  ) {
    this.onActionTriggeredCallbacks = this.onActionTriggeredCallbacks.filter(
      (c) => c !== callback
    );
  }

  async addUiInteractionListener(callback: (data: UiInteractionPayload) => void) {
    const idx = this.onUiInteractionCallbacks.findIndex((c) => c === callback);
    if (idx !== -1) {
      this.onUiInteractionCallbacks[idx] = callback;
    } else {
      this.onUiInteractionCallbacks.push(callback);
    }
  }

  async removeUiInteractionListener(
    callback: (data: UiInteractionPayload) => void
  ) {
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
          body: JSON.stringify({
            userId: userid,
            data: { username: suggestedUsername.result },
          }),
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
          body: JSON.stringify({
            userId: userid,
            data: { username: newUserName },
          }),
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

  async getRoomInfo() {
    try {
      return await this.channelInfo();
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

  async getOlderMessages(
    anonymousMode = false,
    options: {
      query?: object | undefined;
      field?: object | undefined;
      offset?: number;
    } = {
      query: undefined,
      field: undefined,
      offset: 50,
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
    const offset = options?.offset ? options.offset : 0;
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const messages = await fetch(
        `${this.host}/api/v1/${roomType}.${endp}?roomId=${this.rid}${query}${field}&offset=${offset}`,
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
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const messages = await fetch(
        `${this.host}/api/v1/chat.getThreadMessages?tmid=${tmid}`,
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

  async getUserRoles() {
    try {
      const response = await this.getUsersInRole("admin");
      if (response && response.success) {
        return { result: response.users };
      }
      return { result: [] };
    } catch (err) {
      console.error(err);
      return { result: [] };
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
  async sendMessage(
    message: string | (Record<string, unknown> & { msg?: string }),
    threadId: string
  ) {
    const messageObj: { rid: string; msg?: string; tmid?: string } & Record<
      string,
      unknown
    > =
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
        body: JSON.stringify({ roomId: this.rid, msgId }),
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
        body: JSON.stringify({ roomId: this.rid, msgId, text }),
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

  async getAllFiles(isChannelPrivate = false, typeGroup: string) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const url =
        typeGroup === ""
          ? `${this.host}/api/v1/${roomType}.files?roomId=${this.rid}`
          : `${this.host}/api/v1/${roomType}.files?roomId=${this.rid}&typeGroup=${typeGroup}`;
      const response = await fetch(url, {
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

  async getAllImages() {
    try {
      const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
      const response = await fetch(
        `${this.host}/api/v1/rooms.images?roomId=${this.rid}`,
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
        body: JSON.stringify({ messageId: mid }),
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
        body: JSON.stringify({ messageId: mid }),
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
        body: JSON.stringify({ messageId: mid }),
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
        body: JSON.stringify({ messageId: mid }),
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
        body: JSON.stringify({
          messageId,
          emoji,
          shouldReact,
        }),
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
        body: JSON.stringify({ messageId, description }),
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
      if (!userId || !authToken) {
        console.error("sendAttachment: User not authenticated");
        return;
      }

      const form = new FormData();
      form.append("file", file, fileName);

      const uploadResponse = await fetch(
        `${this.host}/api/v1/rooms.media/${this.rid}`,
        {
          method: "POST",
          body: form,
          headers: {
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success || !uploadResult.file?._id) {
        console.error("sendAttachment: Upload failed", uploadResult);
        return uploadResult;
      }

      const confirmResponse = await fetch(
        `${this.host}/api/v1/rooms.mediaConfirm/${this.rid}/${uploadResult.file._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Token": authToken,
            "X-User-Id": userId,
          },
          body: JSON.stringify(
            threadId
              ? { msg: "", description: fileDescription || "", tmid: threadId }
              : { msg: "", description: fileDescription || "" }
          ),
        }
      );

      return await confirmResponse.json();
    } catch (err) {
      console.error("sendAttachment error:", err);
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

  async handleUiKitInteraction(
    appId: string,
    userInteraction: UiInteractionPayload
  ) {
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

      const interaction = (await response.json()) as ActionTriggeredPayload;
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

  async execCommand({
    command,
    params,
    tmid,
  }: {
    command: string;
    params: string;
    tmid?: string;
  }) {
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
        tmid,
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

  async userData(username: string) {
    const { userId, authToken } = (await this.auth.getCurrentUser()) || {};
    const response = await fetch(
      `${this.host}/api/v1/users.info?username=${username}`,
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
