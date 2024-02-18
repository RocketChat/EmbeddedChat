import { Api } from "./Api";

const loginWithResumeToken = async (
  config: {
    api: Api;
  },
  credentials: {
    resume: string;
  }
) => {
  const response = await config.api.post("/api/v1/login", credentials);
  return response.data;
};

export default loginWithResumeToken;
