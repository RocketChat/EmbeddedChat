import loginWithPassword from "./loginWithPassword";
import loginWithOAuthServiceToken from "./loginWithOAuthServiceToken";
import loginWithResumeToken from "./loginWithResumeToken";
import { IRocketChatAuthOptions } from "./IRocketChatAuthOptions";
import { Api, ApiError } from "./Api";
import getRocketChatOAuthCredentials from "./loginWithRocketChatOAuth";
import handleSecureLogin from "./handleSecureLogin";
class RocketChatAuth {
  host: string;
  api: Api;
  currentUser: any;
  lastFetched: Date;
  authListeners: ((user: object | null) => void)[] = [];
  deleteToken: () => Promise<void>;
  saveToken: (token: string) => Promise<void>;
  getToken: () => Promise<string>;
  private sessionUpdate: Promise<unknown> = Promise.resolve();
  private logoutVersion = 0;
  private currentUserVersion = 0;
  // Keep sessions here until Rocket.Chat confirms revocation.
  private pendingRevocations = new Map<string, string>();
  private interruptedRestoreError?: unknown;

  private updateSession<T>(update: (version: number) => Promise<T>) {
    const version = this.logoutVersion;
    const run = () => update(version);
    const result = this.sessionUpdate.then(run, run);
    this.sessionUpdate = result;
    return result;
  }

  private checkLoginVersion(version: number) {
    if (version !== this.logoutVersion) {
      throw new Error("Login was interrupted by logout.");
    }
  }

  private startLogin(
    request: () => Promise<any>,
    version = this.logoutVersion
  ) {
    return this.updateSession(async () => {
      this.checkLoginVersion(version);
      const { data } = await request();
      return this.finishLogin(data, version);
    });
  }

  private async finishLogin(data: any, version: number, resumedToken?: string) {
    await this.persistUser(data, version, data?.authToken !== resumedToken);
    this.checkLoginVersion(version);
    return data;
  }

  constructor({
    host,
    saveToken,
    getToken,
    deleteToken,
  }: IRocketChatAuthOptions) {
    this.host = host;
    this.api = new Api(host);
    this.lastFetched = new Date(0);
    this.currentUser = null;
    this.getToken = getToken;
    this.saveToken = saveToken;
    this.deleteToken = deleteToken;
  }

  /**
   * Add a callback that will be called when user login status changes
   * @param callback
   */
  async onAuthChange(callback: (user: object | null) => void) {
    this.authListeners.push(callback);
    const user = await this.getCurrentUser();
    if (this.authListeners.includes(callback) && user === this.currentUser) {
      callback(user);
    }
  }

  async removeAuthListener(callback: (user: object | null) => void) {
    this.authListeners = this.authListeners.filter((cb) => cb !== callback);
  }

  notifyAuthListeners() {
    this.authListeners.forEach((cb) => cb(this.currentUser));
  }

  /**
   * Login with username and password
   * @param credentials
   * @returns
   */
  async loginWithPassword({
    user,
    password,
    code,
  }: {
    user: string;
    password: string;
    code?: string | number;
  }) {
    return this.startLogin(() =>
      loginWithPassword({ api: this.api }, { user, password, code })
    );
  }

  /**
   * Login with OAuthService's accessToken. The service must be configured in RocketChat.
   * @param credentials
   * @returns
   */
  async loginWithOAuthServiceToken(credentials: {
    [key: string]: string;
    service: string;
    access_token: string;
  }) {
    return this.startLogin(() =>
      loginWithOAuthServiceToken({ api: this.api }, credentials)
    );
  }

  /**
   * Login with RocketChat OAuth. The EmbeddedChatApp must be installed and configured in RocketChat.
   * @returns
   */
  async loginWithRocketChatOAuth() {
    if (typeof window === "undefined") {
      throw new Error("loginWithRocketChatOAuth can only be called in browser");
    }
    const version = this.logoutVersion;
    const credentials = await getRocketChatOAuthCredentials({ api: this.api });
    return this.startLogin(async () => {
      const response = await this.api.post("/api/v1/login", credentials);
      return response.data;
    }, version);
  }

  /**
   * Login with resume token
   * @param resume Previous issued authToken
   * @returns
   */
  async loginWithResumeToken(resume: string) {
    return this.updateSession((version) => this.resumeSession(resume, version));
  }

  private async readForRestore<T>(
    request: Promise<T>,
    version: number,
    token?: string
  ) {
    try {
      return await request;
    } catch (error) {
      // Without the restored user ID, logout cannot confirm server-side revocation.
      if (
        version !== this.logoutVersion &&
        (!token || token !== this.currentUser?.authToken) &&
        !(error instanceof ApiError && error.response.status === 401)
      ) {
        this.interruptedRestoreError = error;
      }
      throw error;
    }
  }

  private async resumeSession(
    token: string,
    version: number,
    expireInvalid = false
  ) {
    let response;
    try {
      response = await this.readForRestore(
        loginWithResumeToken({ api: this.api }, { resume: token }),
        version,
        token
      );
    } catch (error) {
      if (
        !expireInvalid ||
        version !== this.logoutVersion ||
        !(error instanceof ApiError && error.response.status === 401)
      ) {
        throw error;
      }
      // The server rejected this token. Expire it before the next queued login.
      try {
        await this.deleteToken();
      } finally {
        this.clearCurrentUser();
      }
      return null;
    }
    return this.finishLogin(response.data, version, token);
  }

  /**
   * Handles Secure HTTP Only Cookie. The EmbeddedChatApp must be installed and configured in RocketChat.
   * @returns
   */

  async handleSecureLogin(action: string, token?: string) {
    return await handleSecureLogin(
      {
        api: this.api,
      },
      action,
      token
    );
  }

  /**
   * Get current user.
   * @param refresh
   * @returns
   */
  async getCurrentUser(refresh = false) {
    const user = this.currentUser;
    if (!user?.authToken || this.currentUserVersion !== this.logoutVersion)
      return null;
    if (!refresh && Date.now() < this.lastFetched.getTime() + 59 * 60_000)
      return user;

    return this.updateSession(async (version) => {
      if (version !== this.logoutVersion) return null;
      if (user !== this.currentUser) return this.currentUser;
      try {
        await this.resumeSession(user.authToken, version, true);
      } catch (error) {
        if (refresh) throw error;
      }
      return version === this.logoutVersion ? this.currentUser : null;
    });
  }

  /**
   * Set current user
   * @param user
   */
  async setUser(user: object) {
    await this.updateSession((version) => this.persistUser(user, version));
  }

  private async persistUser(
    user: object,
    version: number,
    newlyIssued = false
  ) {
    if (!user || !("authToken" in user) || typeof user.authToken !== "string") {
      throw new Error("The login response is missing the session token.");
    }
    const token = user.authToken;
    try {
      this.checkLoginVersion(version);
      await this.saveToken(token);
      this.checkLoginVersion(version);
    } catch (error) {
      if ("userId" in user && typeof user.userId === "string") {
        if (version !== this.logoutVersion) {
          this.pendingRevocations.set(token, user.userId);
        } else if (newlyIssued && token !== this.currentUser?.authToken) {
          try {
            await this.revokeToken(token, user.userId);
          } catch (revocationError) {
            if (version !== this.logoutVersion)
              this.pendingRevocations.set(token, user.userId);
            throw new AggregateError(
              [error, revocationError],
              "Login failed and the new session could not be revoked."
            );
          }
        }
      }
      throw error;
    }
    this.currentUser = user;
    this.currentUserVersion = version;
    this.lastFetched = new Date();
    this.notifyAuthListeners();
  }

  async save() {
    await this.updateSession(async () => {
      await this.saveToken(this.currentUser.authToken);
      this.notifyAuthListeners();
    });
  }

  /**
   * Load current user from localStorage
   */
  async load() {
    await this.updateSession(async (version) => {
      try {
        const token = await this.readForRestore(this.getToken(), version);
        if (token) await this.resumeSession(token, version);
      } catch (error) {
        if (version === this.logoutVersion) this.notifyAuthListeners();
        if (!(error instanceof ApiError && error.response.status === 401))
          throw error;
      }
    });
  }

  private async revokeToken(token: string, userId: string) {
    try {
      await this.api.post("/api/v1/logout", undefined, {
        headers: { "X-Auth-Token": token, "X-User-Id": userId },
      });
    } catch (error) {
      // An already expired token has no server session left to revoke.
      if (!(error instanceof ApiError && error.response.status === 401)) {
        throw error;
      }
    }
  }

  private clearCurrentUser() {
    this.lastFetched = new Date(0);
    this.currentUser = null;
    this.notifyAuthListeners();
  }

  /**
   * Logout current user
   */
  async logout() {
    this.logoutVersion++;
    await this.updateSession(async () => {
      const sessions = this.pendingRevocations;
      if (this.currentUser) {
        sessions.set(this.currentUser.authToken, this.currentUser.userId);
      }
      try {
        const results = await Promise.allSettled([
          ...Array.from(sessions, async ([token, userId]) => {
            await this.revokeToken(token, userId);
            sessions.delete(token);
          }),
          this.deleteToken(),
        ]);
        for (const result of results) {
          if (result.status === "rejected") throw result.reason;
        }
        if (this.interruptedRestoreError) throw this.interruptedRestoreError;
      } finally {
        this.interruptedRestoreError = undefined;
        this.clearCurrentUser();
      }
    });
  }
}

export default RocketChatAuth;
