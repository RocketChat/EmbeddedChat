import { Rocketchat } from "@rocket.chat/sdk";
import {
  IRocketChatAuthOptions,
  RocketChatAuth,
} from "@embeddedchat/auth";
import { AuthService } from "./services/AuthService";
import { MessageService } from "./services/MessageService";
import { RoomService } from "./services/RoomService";
import { UserService } from "./services/UserService";
import { RealtimeService } from "./services/RealtimeService";

export default class EmbeddedChatApi {
  host: string;
  rid: string;
  rcClient: Rocketchat;
  auth: RocketChatAuth;

  private authService: AuthService;
  private messageService: MessageService;
  private roomService: RoomService;
  private userService: UserService;
  private realtimeService: RealtimeService;

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

    this.auth = new RocketChatAuth({
      host: this.host,
      deleteToken,
      getToken,
      saveToken,
    });

    this.authService = new AuthService(
      this.host,
      this.rid,
      this.auth,
      this.rcClient
    );
    this.messageService = new MessageService(
      this.host,
      this.rid,
      this.auth,
      this.rcClient
    );
    this.roomService = new RoomService(
      this.host,
      this.rid,
      this.auth,
      this.rcClient
    );
    this.userService = new UserService(
      this.host,
      this.rid,
      this.auth,
      this.rcClient
    );
    this.realtimeService = new RealtimeService(
      this.host,
      this.rid,
      this.auth,
      this.rcClient
    );
  }

  setAuth(auth: RocketChatAuth) {
    this.auth = auth;
    this.authService = new AuthService(this.host, this.rid, this.auth, this.rcClient);
    this.messageService = new MessageService(this.host, this.rid, this.auth, this.rcClient);
    this.roomService = new RoomService(this.host, this.rid, this.auth, this.rcClient);
    this.userService = new UserService(this.host, this.rid, this.auth, this.rcClient);
    this.realtimeService = new RealtimeService(this.host, this.rid, this.auth, this.rcClient);
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
    return this.authService.googleSSOLogin(
      signIn,
      acsCode,
      this.updateUserUsername.bind(this)
    );
  }

  async login(userOrEmail: string, password: string, code: string) {
    return this.authService.login(
      userOrEmail,
      password,
      code,
      this.updateUserUsername.bind(this)
    );
  }

  async autoLogin(auth: {
    flow: "PASSWORD" | "OAUTH" | "TOKEN";
    credentials: any;
  }) {
    return this.authService.autoLogin(auth);
  }

  async logout() {
    return this.authService.logout();
  }

  /**
   * All subscriptions are implemented here.
   * TODO: Add logic to call thread message event listeners. To be done after thread implementation
   */
  async connect() {
    return this.realtimeService.connect();
  }

  async addMessageListener(callback: (message: any) => void) {
    return this.realtimeService.addMessageListener(callback);
  }

  async removeMessageListener(callback: (message: any) => void) {
    return this.realtimeService.removeMessageListener(callback);
  }

  async addMessageDeleteListener(callback: (messageId: string) => void) {
    return this.realtimeService.addMessageDeleteListener(callback);
  }

  async removeMessageDeleteListener(callback: (messageId: string) => void) {
    return this.realtimeService.removeMessageDeleteListener(callback);
  }

  async addTypingStatusListener(callback: (users: string[]) => void) {
    return this.realtimeService.addTypingStatusListener(callback);
  }

  async removeTypingStatusListener(callback: (users: string[]) => void) {
    return this.realtimeService.removeTypingStatusListener(callback);
  }

  async addActionTriggeredListener(callback: (data: any) => void) {
    return this.realtimeService.addActionTriggeredListener(callback);
  }

  async removeActionTriggeredListener(callback: (data: any) => void) {
    return this.realtimeService.removeActionTriggeredListener(callback);
  }

  async addUiInteractionListener(callback: (data: any) => void) {
    return this.realtimeService.addUiInteractionListener(callback);
  }

  async removeUiInteractionListener(callback: (data: any) => void) {
    return this.realtimeService.removeUiInteractionListener(callback);
  }

  handleTypingEvent(data: any) {
    return this.realtimeService.handleTypingEvent(data);
  }

  async getRCAppInfo() {
    return this.roomService.getRCAppInfo();
  }

  async updateUserNameThroughSuggestion(userid: string) {
    return this.userService.updateUserNameThroughSuggestion(userid);
  }

  async updateUserUsername(userid: string, username: string) {
    return this.userService.updateUserUsername(userid, username);
  }

  async channelInfo(isChannelPrivate = false) {
    return this.roomService.channelInfo(isChannelPrivate);
  }

  async getRoomInfo() {
    return this.roomService.getRoomInfo();
  }

  async permissionInfo() {
    return this.roomService.permissionInfo();
  }

  async close() {
    return this.realtimeService.close();
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
    return this.messageService.getMessages(
      anonymousMode,
      options,
      isChannelPrivate
    );
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
    return this.messageService.getOlderMessages(
      anonymousMode,
      options,
      isChannelPrivate
    );
  }

  async getThreadMessages(tmid: string, isChannelPrivate = false) {
    return this.messageService.getThreadMessages(tmid, isChannelPrivate);
  }

  async getChannelRoles(isChannelPrivate = false) {
    return this.roomService.getChannelRoles(isChannelPrivate);
  }

  async getUsersInRole(role: string) {
    return this.userService.getUsersInRole(role);
  }

  async getUserRoles() {
    return this.userService.getUserRoles();
  }

  async sendTypingStatus(username: string, typing: boolean) {
    return this.realtimeService.sendTypingStatus(username, typing);
  }

  async sendMessage(message: any, threadId: string) {
    return this.messageService.sendMessage(message, threadId);
  }

  async deleteMessage(msgId: string) {
    return this.messageService.deleteMessage(msgId);
  }

  async updateMessage(msgId: string, text: string) {
    return this.messageService.updateMessage(msgId, text);
  }

  async getAllFiles(isChannelPrivate = false, typeGroup: string) {
    return this.roomService.getAllFiles(isChannelPrivate, typeGroup);
  }

  async getAllImages() {
    return this.roomService.getAllImages();
  }

  async starMessage(mid: string) {
    return this.messageService.starMessage(mid);
  }

  async unstarMessage(mid: string) {
    return this.messageService.unstarMessage(mid);
  }

  async getStarredMessages() {
    return this.messageService.getStarredMessages();
  }

  async getPinnedMessages() {
    return this.messageService.getPinnedMessages();
  }

  async getMentionedMessages() {
    return this.messageService.getMentionedMessages();
  }

  async pinMessage(mid: string) {
    return this.messageService.pinMessage(mid);
  }

  async unpinMessage(mid: string) {
    return this.messageService.unpinMessage(mid);
  }

  async reactToMessage(emoji: string, messageId: string, shouldReact: string) {
    return this.messageService.reactToMessage(emoji, messageId, shouldReact);
  }

  async reportMessage(messageId: string, description: string) {
    return this.messageService.reportMessage(messageId, description);
  }

  async findOrCreateInvite() {
    return this.roomService.findOrCreateInvite();
  }

  async sendAttachment(
    file: File,
    fileName: string,
    fileDescription = "",
    threadId = undefined
  ) {
    return this.messageService.sendAttachment(
      file,
      fileName,
      fileDescription,
      threadId
    );
  }

  async me() {
    return this.userService.me();
  }

  async getChannelMembers(isChannelPrivate = false) {
    return this.roomService.getChannelMembers(isChannelPrivate);
  }

  async getSearchMessages(text: string) {
    return this.messageService.getSearchMessages(text);
  }

  async getMessageLimit() {
    return this.messageService.getMessageLimit();
  }

  async handleUiKitInteraction(appId: string, userInteraction: any) {
    return this.realtimeService.handleUiKitInteraction(appId, userInteraction);
  }

  async getCommandsList() {
    return this.messageService.getCommandsList();
  }

  async execCommand(args: { command: string; params: string; tmid?: string }) {
    return this.messageService.execCommand(args);
  }

  async getUserStatus(reqUserId: string) {
    return this.userService.getUserStatus(reqUserId);
  }

  async userInfo(reqUserId: string) {
    return this.userService.userInfo(reqUserId);
  }

  async userData(username: string) {
    return this.userService.userData(username);
  }
}
