import { RocketChatAuth } from "@embeddedchat/auth";

export interface IChatProvider {
    sendTypingStatus(username: string, typing: boolean): Promise<void>;

    addMessageListener(callback: (message: any) => void): void;
    removeMessageListener(callback: (message: any) => void): void;
    addMessageDeleteListener(callback: (messageId: string) => void): void;
    removeMessageDeleteListener(callback: (messageId: string) => void): void;
    addTypingStatusListener(callback: (users: string[]) => void): void;
    removeTypingStatusListener(callback: (users: string[]) => void): void;
    addActionTriggeredListener(callback: (data: any) => void): void;
    removeActionTriggeredListener(callback: (data: any) => void): void;
    addUiInteractionListener(callback: (data: any) => void): void;
    removeUiInteractionListener(callback: (data: any) => void): void;

    login(userOrEmail: string, password: string, code?: string): Promise<any>;
    logout(): Promise<void>;
    autoLogin(auth: { flow: "PASSWORD" | "OAUTH" | "TOKEN"; credentials: any }): Promise<void>;
    googleSSOLogin(signIn: Function, acsCode: string): Promise<any>;

    getRCAppInfo(): Promise<any>;
    updateUserUsername(userid: string, username: string): Promise<any>;
    channelInfo(): Promise<any>;
    getRoomInfo(): Promise<any>;
    permissionInfo(): Promise<any>;

    setAuth(auth: RocketChatAuth): void;
    getAuth(): RocketChatAuth;
    getHost(): string;
}
