import { Api } from "./Api";

const loginWithPassword = async (
  config: {
    api: Api;
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
  const response = await config.api.post("/api/v1/login", {
    user,
    password,
    code,
  });
  return response.data;
};

export default loginWithPassword;
