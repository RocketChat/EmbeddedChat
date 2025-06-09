import { DDPSDK } from "@rocket.chat/ddp-client";

const loginWithOAuthServiceToken = async (
  config: {
    api: DDPSDK;
  },
  credentials: {
    service: string;
    access_token: string;
    [key: string]: string;
  }
) => {
  const response = await config.api.rest.post("/v1/login", credentials as any);
  return response;
};

export default loginWithOAuthServiceToken;
