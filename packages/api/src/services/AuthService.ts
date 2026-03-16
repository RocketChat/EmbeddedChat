import { ApiError } from "@embeddedchat/auth";
import { BaseService } from "./BaseService";

export class AuthService extends BaseService {
  async googleSSOLogin(
    signIn: Function,
    acsCode: string,
    updateUserUsername: (userid: string, username: string) => Promise<any>
  ) {
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
          await updateUserUsername(response.data.userId, response.data.me.name);
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

  async login(
    userOrEmail: string,
    password: string,
    code: string,
    updateUserUsername: (userid: string, username: string) => Promise<any>
  ) {
    let credentials;
    if (!code) {
      credentials = {
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
        await updateUserUsername(data.userId, data.me.name);
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
}
