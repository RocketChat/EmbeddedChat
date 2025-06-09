import { DDPSDK } from "@rocket.chat/ddp-client";

const loginWithPassword = async (
  config: {
    api: DDPSDK;
  },
  {
    user,
    password,
    code,
  }: {
    user: string;
    password: string;
    code?: string | number;
  }
) => {
  const response = await config.api.rest.post("/v1/login", {
    user,
    password,
    code: code !== undefined ? String(code) : undefined,
  });
  return response;
};

export default loginWithPassword;
