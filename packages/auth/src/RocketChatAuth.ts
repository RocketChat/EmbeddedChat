import loginWithPassword from "./loginWithPassword";
import loginWithOAuthServiceToken from "./loginWithOAuthServiceToken";
import loginWithResumeToken from "./loginWithResumeToken";
import { IRocketChatAuthOptions } from "./IRocketChatAuthOptions";
import { Api, ApiError } from "./Api";
import loginWithRocketChatOAuth from "./loginWithRocketChatOAuth";
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
    callback(user);
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
    const response = await loginWithPassword(
      {
        api: this.api,
      },
      {
        user,
        password,
        code,
      }
    );
    this.setUser(response.data);
    return this.currentUser;
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
    const response = await loginWithOAuthServiceToken(
      {
        api: this.api,
      },
      credentials
    );
    this.setUser(response.data);
    return this.currentUser;
  }

  /**
   * Login with RocketChat OAuth. The EmbeddedChatApp must be installed and configured in RocketChat.
   * @returns
   */
  async loginWithRocketChatOAuth() {
    if (typeof window === "undefined") {
      throw new Error("loginWithRocketChatOAuth can only be called in browser");
    }
    const response = await loginWithRocketChatOAuth({
      api: this.api,
    });
    this.setUser(response.data);
    return this.currentUser;
  }

  /**
   * Login with resume token
   * @param resume Previous issued authToken
   * @returns
   */
  async loginWithResumeToken(resume: string) {
    const response = await loginWithResumeToken(
      {
        api: this.api,
      },
      {
        resume,
      }
    );
    this.setUser(response.data);
    return this.currentUser;
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
    if (this.currentUser && this.currentUser.authToken) {
      if (
        refresh ||
        new Date() >= new Date(this.lastFetched.getTime() + 3540000)
      ) {
        // 59 minutes
        try {
          await this.loginWithResumeToken(this.currentUser.authToken);
        } catch (e) {
          if (e instanceof ApiError && e.response?.status === 401) {
            // token cannot be refreshed as the resume token is no longer valid.
            await this.logout();
          }
        }
      }
    }
    return this.currentUser;
  }

  /**
   * Set current user
   * @param user
   */
  async setUser(user: object) {
    this.lastFetched = new Date();
    this.currentUser = user;
    await this.save();
  }

  async save() {
    await this.saveToken(this.currentUser.authToken);
    this.notifyAuthListeners();
  }

  /**
   * Load current user from localStorage
   */
  async load() {
    try {
      const token = await this.getToken();
      if (token) {
        const user = await this.loginWithResumeToken(token); // will notifyAuthListeners on successful login
        if (user) {
          this.lastFetched = new Date();
          await this.getCurrentUser(); // refresh the token if needed
        }
      }
    } catch (e) {
      console.log("Failed to login user on initial load. Sign in.");
      this.notifyAuthListeners();
    }
  }

  /**
   * Logout current user
   */
  async logout() {
    try {
      await this.api.post(`/api/v1/logout`, undefined, {
        headers: {
          "X-Auth-Token": this.currentUser.authToken,
          "X-User-Id": this.currentUser.userId,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      await this.deleteToken();
    }
    this.lastFetched = new Date(0);
    this.currentUser = null;
    this.notifyAuthListeners();
  }
}

export default RocketChatAuth;
