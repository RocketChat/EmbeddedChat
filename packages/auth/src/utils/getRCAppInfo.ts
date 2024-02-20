import { getRCAppBaseURL } from "./getRCAppBaseURL";

export const getRCAppInfo = async (host: string) => {
  const rcAppBaseUrl = getRCAppBaseURL(host);
  const infoUrl = rcAppBaseUrl + "/info";
  const response = await fetch(infoUrl.toString());
  if (!response.ok) {
    return null;
  }
  const info = await response.json();
  return info;
};
