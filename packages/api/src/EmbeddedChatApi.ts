import { DDPSDK } from "@rocket.chat/ddp-client";
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
  sdk: DDPSDK;
  onMessageCallbacks: ((message: any) => void)[];
  onMessageDeleteCallbacks: ((messageId: string) => void)[];
  onTypingStatusCallbacks: ((users: string[]) => void)[];
  onActionTriggeredCallbacks: ((data: any) => void)[];
  onUiInteractionCallbacks: ((data: any) => void)[];
  typingUsers: string[];
  auth: RocketChatAuth;
  private _connectPromise: Promise<void> | null = null;
  private _activeSubscriptions: { stop: () => void }[] = [];
  private _authListener: ((user: any) => void) | null = null;

  constructor(
    host: string,
    rid: string,
    { getToken, saveToken, deleteToken }: IRocketChatAuthOptions
  ) {
    this.host = host;
    this.rid = rid;
    this.sdk = DDPSDK.create(this.host, {
      retryCount: 10,
      retryTime: 2000,
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
    this._registerAuthListener();
  }

  private _applyCredentials(user: any) {
    const userId = user?.userId || user?.data?.userId;
    const authToken = user?.authToken || user?.data?.authToken;
    if (userId && authToken) {
      this.sdk.rest.setCredentials({
        "X-User-Id": userId,
        "X-Auth-Token": authToken,
      });
    }
  }

  private _registerAuthListener() {
    this._authListener = (user: any) => {
      if (user) {
        this._applyCredentials(user);
      }
    };
    this.auth.onAuthChange(this._authListener);
  }

  private async _restRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any
  ) {
    const options: RequestInit = {};
    if (body !== undefined) {
      options.headers = { "Content-Type": "application/json" };
      options.body = typeof body === "string" ? body : JSON.stringify(body);
    }
    const response = await this.sdk.rest.send(endpoint, method, options);
    return response.json();
  }

  private async _restUpload(endpoint: string, formData: FormData) {
    const response = await this.sdk.rest.send(endpoint, "POST", {
      body: formData,
    });
    return response.json();
  }

  setAuth(auth: RocketChatAuth) {
    // Remove listener from the old auth instance before swapping.
    if (this._authListener) {
      this.auth.removeAuthListener(this._authListener);
    }
    this.auth = auth;
    this._registerAuthListener();
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
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
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
      console.error(error instanceof Error ? error.message : error);
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
      console.error(
        "Auto-login failed:",
        error instanceof Error ? error.message : error
      );
    }
  }

  async logout() {
    try {
      await this.auth.logout();
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  /**
   * All subscriptions are implemented here.
   * TODO: Add logic to call thread message event listeners. To be done after thread implementation
   */
  async connect() {
    // Guard against concurrent connect() calls (e.g. React StrictMode double-invoke)
    if (this._connectPromise) {
      return this._connectPromise;
    }
    this._connectPromise = this._doConnect().finally(() => {
      this._connectPromise = null;
    });
    return this._connectPromise;
  }

  private _normalizeMessage(data: any) {
    if (!data) return null;
    const message = JSON.parse(JSON.stringify(data));
    if (message.ts?.$date) {
      message.ts = message.ts.$date;
    }
    if (!message.ts) {
      message.ts = new Date().toISOString();
    }
    return message;
  }

  private async _doConnect() {
    try {
      this.close(); // before connection, all previous subscriptions should be cancelled
      await this.sdk.connection.connect();

      const currentUser = (await this.auth.getCurrentUser()) as any;
      const token = currentUser?.authToken || currentUser?.data?.authToken;
      if (token) {
        await this.sdk.account.loginWithToken(token);
      }

      // Subscribe to room messages
      const roomMsgSub = this.sdk.stream(
        "room-messages",
        [this.rid, false],
        (data: any) => {
          const message = this._normalizeMessage(data);
          if (message) {
            this.onMessageCallbacks.forEach((callback) => callback(message));
          }
        }
      );
      this._activeSubscriptions.push(roomMsgSub);

      // Subscribe to room notifications (typing, delete)
      const notifyRoomSub = this.sdk.stream(
        "notify-room",
        [`${this.rid}/user-activity`, false],
        (...args: any[]) => {
          const typingUser = args[0];
          const activities = args[1];
          if (Array.isArray(activities)) {
            const isTyping = activities.includes("user-typing");
            this.handleTypingEvent({ typingUser, isTyping });
          } else {
            // Legacy "typing" event: args[1] is a boolean
            this.handleTypingEvent({ typingUser, isTyping: !!activities });
          }
        }
      );
      this._activeSubscriptions.push(notifyRoomSub);

      // Subscribe to room delete events
      const deleteRoomSub = this.sdk.stream(
        "notify-room",
        [`${this.rid}/deleteMessage`, false],
        (...args: any[]) => {
          const messageId = args[0]?._id;
          if (messageId) {
            this.onMessageDeleteCallbacks.forEach((callback) =>
              callback(messageId)
            );
          }
        }
      );
      this._activeSubscriptions.push(deleteRoomSub);

      // Subscribe to user notifications (action triggers, UI interactions)
      const userId = this.sdk.account.uid;
      if (userId) {
        const notifyUserMsgSub = this.sdk.stream(
          "notify-user",
          [`${userId}/message`, false],
          (data: any) => {
            if (!data || data?.rid !== this.rid) {
              return;
            }
            const message = this._normalizeMessage(data);
            if (message) {
              message.renderType = "blocks";
              this.onMessageCallbacks.forEach((callback) => callback(message));
            }
          }
        );
        this._activeSubscriptions.push(notifyUserMsgSub);

        const notifyUserUiSub = this.sdk.stream(
          "notify-user",
          [`${userId}/uiInteraction`, false],
          (data: any) => {
            this.onUiInteractionCallbacks.forEach((callback) => callback(data));
          }
        );
        this._activeSubscriptions.push(notifyUserUiSub);
      }
    } catch (err) {
      this.close();
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
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async updateUserNameThroughSuggestion(userid: string) {
    try {
      const suggestedUsername = await this._restRequest(
        "/v1/users.getUsernameSuggestion"
      );
      if (suggestedUsername.success) {
        return await this._restRequest("/v1/users.update", "POST", {
          userId: userid,
          data: { username: suggestedUsername.result },
        });
      }
    } catch (error: any) {
      console.error(error instanceof Error ? error.message : error);
      return error;
    }
  }

  async updateUserUsername(userid: string, username: string) {
    const newUserName = username.replace(/\s/g, ".").toLowerCase();
    const usernameRegExp = /[0-9a-zA-Z-_.]+/;

    if (usernameRegExp.test(newUserName)) {
      try {
        return await this._restRequest("/v1/users.update", "POST", {
          userId: userid,
          data: { username: newUserName },
        });
      } catch (err: any) {
        if (err?.errorType === "error-could-not-save-identity") {
          return await this.updateUserNameThroughSuggestion(userid);
        }
        console.error(err instanceof Error ? err.message : err);
      }
    } else {
      return this.updateUserNameThroughSuggestion(userid);
    }
  }

  async channelInfo(): Promise<any> {
    try {
      return await this._restRequest(`/v1/rooms.info?roomId=${this.rid}`);
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async getRoomInfo(): Promise<any> {
    try {
      return await this.channelInfo();
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async permissionInfo() {
    try {
      return await this._restRequest("/v1/permissions.listAll");
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async close() {
    this._activeSubscriptions.forEach((sub) => sub.stop());
    this._activeSubscriptions = [];
    this.sdk.connection.close();
  }

  async getMessages(
    anonymousMode = false,
    options: {
      oldest?: string;
      latest?: string;
      count?: number;
    } = {},
    isChannelPrivate = false
  ) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    const endp = anonymousMode ? "anonymousread" : "messages";
    const oldest = options?.oldest ? `&oldest=${options.oldest}` : "";
    const latest = options?.latest ? `&latest=${options.latest}` : "";
    const count = options?.count != null ? `&count=${options.count}` : "";
    try {
      return await this._restRequest(
        `/v1/${roomType}.${endp}?roomId=${this.rid}${oldest}${latest}${count}`
      );
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async getOlderMessages(
    anonymousMode = false,
    options: {
      oldest?: string;
      latest?: string;
      count?: number;
      offset?: number;
    } = {},
    isChannelPrivate = false
  ) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    const endp = anonymousMode ? "anonymousread" : "messages";
    const oldest = options?.oldest ? `&oldest=${options.oldest}` : "";
    const latest = options?.latest ? `&latest=${options.latest}` : "";
    const count = options?.count != null ? `&count=${options.count}` : "";
    const offset = options?.offset ? `&offset=${options.offset}` : "&offset=0";
    try {
      return await this._restRequest(
        `/v1/${roomType}.${endp}?roomId=${this.rid}${oldest}${latest}${count}${offset}`
      );
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : String(err));
      return err;
    }
  }

  async getThreadMessages(
    tmid: string,
    isChannelPrivate = false
  ): Promise<any> {
    try {
      return await this._restRequest(`/v1/chat.getThreadMessages?tmid=${tmid}`);
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : String(err));
      return err;
    }
  }

  async getChannelRoles(isChannelPrivate = false) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      return await this._restRequest(
        `/v1/${roomType}.roles?roomId=${this.rid}`
      );
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : String(err));
      return err;
    }
  }

  async getUsersInRole(role: string) {
    try {
      return await this._restRequest(`/v1/roles.getUsersInRole?role=${role}`);
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : String(err));
      return err;
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
      console.error(err instanceof Error ? err.message : err);
      return { result: [] };
    }
  }

  async sendTypingStatus(username: string, typing: boolean) {
    try {
      await this.sdk.call(
        "stream-notify-room",
        `${this.rid}/user-activity`,
        username,
        typing ? ["user-typing"] : []
      );
    } catch (err) {
      // DDP typing indicator fails when connection is temporarily down — expected, safe to ignore
    }
  }

  /**
   * @param {*} message should be a string or an rc message object
   * Refer https://developer.rocket.chat/reference/api/schema-definition/message#message-object
   */
  async sendMessage(message: any, threadId: string): Promise<any> {
    const messageObj =
      typeof message === "string"
        ? { rid: this.rid, msg: message }
        : { ...message, rid: this.rid };
    if (threadId) {
      messageObj.tmid = threadId;
    }
    try {
      return await this._restRequest("/v1/chat.sendMessage", "POST", {
        message: messageObj,
      });
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async deleteMessage(msgId: string): Promise<any> {
    try {
      return await this._restRequest("/v1/chat.delete", "POST", {
        roomId: this.rid,
        msgId,
      });
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async updateMessage(msgId: string, text: string): Promise<any> {
    try {
      return await this._restRequest("/v1/chat.update", "POST", {
        roomId: this.rid,
        msgId,
        text,
      });
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async getAllFiles(isChannelPrivate = false, typeGroup: string) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      const endpoint =
        typeGroup === ""
          ? `/v1/${roomType}.files?roomId=${this.rid}`
          : `/v1/${roomType}.files?roomId=${this.rid}&typeGroup=${typeGroup}`;
      return await this._restRequest(endpoint);
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async getAllImages(): Promise<any> {
    try {
      return await this._restRequest(`/v1/rooms.images?roomId=${this.rid}`);
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async starMessage(mid: string) {
    try {
      return await this._restRequest("/v1/chat.starMessage", "POST", {
        messageId: mid,
      });
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async unstarMessage(mid: string) {
    try {
      return await this._restRequest("/v1/chat.unStarMessage", "POST", {
        messageId: mid,
      });
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async getStarredMessages(): Promise<any> {
    try {
      return await this._restRequest(
        `/v1/chat.getStarredMessages?roomId=${this.rid}`
      );
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async getPinnedMessages(): Promise<any> {
    try {
      return await this._restRequest(
        `/v1/chat.getPinnedMessages?roomId=${this.rid}`
      );
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async getMentionedMessages(): Promise<any> {
    try {
      return await this._restRequest(
        `/v1/chat.getMentionedMessages?roomId=${this.rid}`
      );
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async pinMessage(mid: string) {
    try {
      return await this._restRequest("/v1/chat.pinMessage", "POST", {
        messageId: mid,
      });
    } catch (err) {
      return { error: err };
    }
  }

  async unpinMessage(mid: string) {
    try {
      return await this._restRequest("/v1/chat.unPinMessage", "POST", {
        messageId: mid,
      });
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async reactToMessage(
    emoji: string,
    messageId: string,
    shouldReact: boolean | string
  ): Promise<any> {
    try {
      return await this._restRequest("/v1/chat.react", "POST", {
        messageId,
        emoji,
        shouldReact:
          typeof shouldReact === "string"
            ? shouldReact === "true"
            : shouldReact,
      });
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async reportMessage(messageId: string, description: string): Promise<any> {
    try {
      return await this._restRequest("/v1/chat.reportMessage", "POST", {
        messageId,
        description,
      });
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async findOrCreateInvite(): Promise<any> {
    try {
      return await this._restRequest("/v1/findOrCreateInvite", "POST", {
        rid: this.rid,
        days: 1,
        maxUses: 10,
      });
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : String(err));
      return err;
    }
  }

  async sendAttachment(
    file: File,
    fileName: string,
    fileDescription = "",
    threadId = undefined
  ) {
    try {
      const currentUser = await this.auth.getCurrentUser();
      if (!currentUser?.userId || !currentUser?.authToken) {
        console.error("sendAttachment: User not authenticated");
        return;
      }

      const form = new FormData();
      form.append("file", file, fileName);

      const uploadResult = await this._restUpload(
        `/v1/rooms.media/${this.rid}`,
        form
      );

      if (!uploadResult.success || !uploadResult.file?._id) {
        console.error("sendAttachment: Upload failed", uploadResult);
        return uploadResult;
      }

      return await this._restRequest(
        `/v1/rooms.mediaConfirm/${this.rid}/${uploadResult.file._id}`,
        "POST",
        threadId
          ? { msg: "", description: fileDescription || "", tmid: threadId }
          : { msg: "", description: fileDescription || "" }
      );
    } catch (err) {
      console.error("sendAttachment error:", err);
    }
  }

  async me(): Promise<any> {
    try {
      return await this._restRequest("/v1/me");
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async getChannelMembers(isChannelPrivate = false) {
    const roomType = isChannelPrivate ? "groups" : "channels";
    try {
      return await this._restRequest(
        `/v1/${roomType}.members?roomId=${this.rid}`
      );
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async getSearchMessages(text: string): Promise<any> {
    try {
      return await this._restRequest(
        `/v1/chat.search?roomId=${this.rid}&searchText=${encodeURIComponent(
          text
        )}`
      );
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async getMessageLimit() {
    try {
      return await this._restRequest("/v1/settings/Message_MaxAllowedSize");
    } catch (err: any) {
      console.error(err instanceof Error ? err.message : err);
      return err;
    }
  }

  async handleUiKitInteraction(appId: string, userInteraction: any) {
    try {
      const triggerId = Math.random().toString(32).slice(2, 16);
      const interaction = await this._restRequest(
        `/apps/ui.interaction/${appId}`,
        "POST",
        { triggerId, ...userInteraction }
      );
      this.onActionTriggeredCallbacks.forEach((cb) => cb(interaction));
      return interaction;
    } catch (e) {
      console.error(e);
    }
  }

  async getCommandsList() {
    return await this._restRequest("/v1/commands.list");
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
    return await this._restRequest("/v1/commands.run", "POST", {
      command,
      params,
      tmid,
      roomId: this.rid,
      triggerId: Math.random().toString(32).slice(2, 20),
    });
  }

  async getUserStatus(reqUserId: string) {
    return await this._restRequest(`/v1/users.getStatus?userId=${reqUserId}`);
  }

  async userInfo(reqUserId: string): Promise<any> {
    return await this._restRequest(`/v1/users.info?userId=${reqUserId}`);
  }

  async userData(username: string): Promise<any> {
    return await this._restRequest(
      `/v1/users.info?username=${encodeURIComponent(username)}`
    );
  }
}
