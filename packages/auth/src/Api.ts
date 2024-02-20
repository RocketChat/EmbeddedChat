export class ApiError extends Error {
  response: Response;
  constructor(
    response: Response,
    message?: string | undefined,
    options?: ErrorOptions | undefined,
    ...other: any[]
  ) {
    super(message, options, ...(other as []));
    this.response = response;
  }
}

export class Api {
  baseUrl: string;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  getFetchConfig = (config: RequestInit) => {
    const headers = {
      "Content-Type": "application/json",
      ...(config?.headers || {}),
    };
    const requestInit: RequestInit = {
      ...config,
      headers,
    };
    return requestInit;
  };
  async request(
    method: string = "GET",
    endpoint: string,
    data: any,
    config: RequestInit
  ) {
    const url = new URL(endpoint, this.baseUrl).toString();
    const response = await fetch(url, {
      body: data ? JSON.stringify(data) : undefined,
      method,
      headers: {
        ...config.headers,
      },
    });
    if (!response.ok) {
      throw new ApiError(response, "Failed Api Request for " + endpoint);
    }
    const jsonData = await response.json();
    return { data: jsonData };
  }

  async post(endpoint: string, data: any, config: RequestInit = {}) {
    return this.request("POST", endpoint, data, this.getFetchConfig(config));
  }
  async get(endpoint: string, config: RequestInit = {}) {
    return this.request("GET", endpoint, null, this.getFetchConfig(config));
  }
  async put(endpoint: string, data: any, config: RequestInit = {}) {
    return this.request("PUT", endpoint, data, this.getFetchConfig(config));
  }
  async delete(endpoint: string, config: RequestInit = {}) {
    return this.request("DELETE", endpoint, null, this.getFetchConfig(config));
  }
}
