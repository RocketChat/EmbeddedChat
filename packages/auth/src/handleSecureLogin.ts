import { Api } from "./Api";
import { getRCAppInfo } from "./utils/getRCAppInfo";
import { getRCAppBaseURL } from "./utils/getRCAppBaseURL";
import { tokenRequestHandler } from "./utils/tokenRequestHandler";
const handleSecureLogin = async (
  config: { api: Api },
  action: string,
  token?: string
) => {
  const appInfo = await getRCAppInfo(config.api.baseUrl);

  if (!appInfo) {
    throw new Error("EmbeddedChatApp not found on the server.");
  }

  const rcAppBaseUrl = getRCAppBaseURL(config.api.baseUrl);
  const { allowedOrigins } = appInfo.config;
  const currentOrigin = window.location.origin;

  if (!allowedOrigins.includes(currentOrigin)) {
    throw new Error(
      "Origin configuration error. Please ensure the EmbeddedChatApp is correctly configured on the Rocket.Chat server."
    );
  }

  const tokenUrl = `${rcAppBaseUrl}/auth-token`;

  const actionHandlers: Record<string, () => Promise<void> | Promise<any>> = {
    save: () => tokenRequestHandler("POST", tokenUrl, token),
    get: () => tokenRequestHandler("GET", tokenUrl),
    delete: () => tokenRequestHandler("DELETE", tokenUrl),
  };

  const handler = actionHandlers[action];
  if (handler) {
    return await handler();
  } else {
    throw new Error(`Undefined action: ${action}`);
  }
};

export default handleSecureLogin;
