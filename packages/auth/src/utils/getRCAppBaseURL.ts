import { ROCKETCHAT_APP_ID } from "./constants";

export const getRCAppBaseURL = (host: string) => {
  const url = new URL(`api/apps/public/${ROCKETCHAT_APP_ID}`, host);
  return url.toString();
};
