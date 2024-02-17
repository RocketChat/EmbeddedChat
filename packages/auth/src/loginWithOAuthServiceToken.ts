import { Api } from "./Api";

const loginWithOAuthServiceToken = async (
  config: {
    api: Api;
  },
  credentials: {
    service: string;
    access_token: string;
    [key: string]: string;
  }
) => {
  const response = await config.api.post("/api/v1/login", credentials);
  return response.data;
};

export default loginWithOAuthServiceToken;
