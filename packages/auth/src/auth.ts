import { IRocketChatAuthOptions } from "./IRocketChatAuthOptions";
import RocketChatAuth from "./RocketChatAuth";

const rocketChatAuth = ({
  host,
  saveToken,
  getToken,
  deleteToken,
}: IRocketChatAuthOptions) => {
  return new RocketChatAuth({
    host,
    saveToken,
    getToken,
    deleteToken,
  });
};

export { rocketChatAuth };
