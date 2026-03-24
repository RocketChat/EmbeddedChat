import { RocketChatAuth } from "@embeddedchat/auth";

export class RCApiError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`RC API Error ${status}`);
    this.name = "RCApiError";
  }
}

export class ApiClient {
  private host: string;
  private auth: RocketChatAuth;

  constructor(host: string, auth: RocketChatAuth) {
    this.host = host;
    this.auth = auth;
  }

  private async buildHeaders(): Promise<Record<string, string>> {
    const user = await this.auth.getCurrentUser();
    return {
      "Content-Type": "application/json",
      "X-Auth-Token": user?.authToken ?? "",
      "X-User-Id": user?.userId ?? "",
    };
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.host}/api/v1/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    try {
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: await this.buildHeaders(),
      });
      if (!res.ok) {
        throw new RCApiError(res.status, await res.json());
      }
      return res.json();
    } catch (err) {
      if (err instanceof RCApiError) throw err;
      throw new Error(`Network error on GET ${endpoint}: ${err}`);
    }
  }

  async post<T>(endpoint: string, body?: object): Promise<T> {
    try {
      const res = await fetch(`${this.host}/api/v1/${endpoint}`, {
        method: "POST",
        headers: await this.buildHeaders(),
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        throw new RCApiError(res.status, await res.json());
      }
      return res.json();
    } catch (err) {
      if (err instanceof RCApiError) throw err;
      throw new Error(`Network error on POST ${endpoint}: ${err}`);
    }
  }
}
