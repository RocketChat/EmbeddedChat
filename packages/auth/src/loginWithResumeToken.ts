import { DDPSDK } from "@rocket.chat/ddp-client";

const loginWithResumeToken = async (
  config: {
    api: DDPSDK;
  },
  credentials: {
    resume: string;
  }
) => {
  const response = await config.api.rest.post("/v1/login", credentials as any);
  return response;
};

export default loginWithResumeToken;
