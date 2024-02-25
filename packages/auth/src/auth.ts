import { IRocketChatAuthOptions } from "./IRocketChatAuthOptions";
import RocketChatAuth from "./RocketChatAuth";

const rocketChatAuth = ({
  host,
  saveToken,
  getToken,
  deleteToken,
  autoLogin,
}: IRocketChatAuthOptions) => {
  return new RocketChatAuth({
    host,
    saveToken,
    getToken,
    deleteToken,
    autoLogin,
  });
};

export { rocketChatAuth };
