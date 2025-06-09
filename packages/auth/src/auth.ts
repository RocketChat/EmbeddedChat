import { IRocketChatAuthOptions } from "./IRocketChatAuthOptions";
import RocketChatAuth from "./RocketChatAuth";

const rocketChatAuth = ({
  host,
  rcClient,
  saveToken,
  getToken,
  deleteToken,
}: IRocketChatAuthOptions) => {
  return new RocketChatAuth({
    host,
    rcClient,
    saveToken,
    getToken,
    deleteToken,
  });
};

export { rocketChatAuth };