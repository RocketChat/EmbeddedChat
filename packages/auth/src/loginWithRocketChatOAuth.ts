import { Api } from "./Api";
import { getRCAppInfo } from "./utils/getRCAppInfo";
import { getRCAuthorizeURL } from "./utils/getRCAuthorizeURL";

const loginWithRocketChatOAuth = async (config: { api: Api }) => {
  const appInfo = await getRCAppInfo(config.api.baseUrl);
  if (!appInfo) {
    throw new Error("EmbeddedChatApp not found on server");
  }
  const { client_id, serviceName, allowedOrigins, redirect_uri } =
    appInfo.config;

  if (!client_id) {
    throw new Error(
      "client_id not found. Make sure you have configured the EmbeddedChatApp on Rocket.Chat server"
    );
  }
  if (!serviceName) {
    throw new Error(
      "custom_oauth_name not found. Make sure you have configured the EmbeddedChatApp on Rocket.Chat server"
    );
  }
  if (!redirect_uri) {
    throw new Error(
      "redirect_uri not found. Make sure you have configured the EmbeddedChatApp on Rocket.Chat server"
    );
  }
  if (
    allowedOrigins.length &&
    !allowedOrigins.includes(window.location.origin)
  ) {
    throw new Error(
      "Origin not allowed. Make sure you have configured the EmbeddedChatApp on Rocket.Chat server"
    );
  }
  const authorizeUrl = getRCAuthorizeURL(
    config.api.baseUrl,
    redirect_uri,
    client_id
  );
  let params = \`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
width=800,height=600,left=-1000,top=-1000,rel=opener\`;
  const popup = window.open(authorizeUrl, "Login", params);

  return new Promise<any>((resolve, reject) => {
    if (popup) {
      let checkInterval: ReturnType<typeof setInterval>;
      let settled = false;

      const cleanup = () => {
        clearInterval(checkInterval);
        window.removeEventListener("message", onMessage);
      };

      const onMessage = async (e: MessageEvent) => {
        if (e.data.type === "rc-oauth-callback") {
          if (settled) return;
          settled = true;
          cleanup();
          try {
            const { accessToken, expiresIn, serviceName } = e.data.credentials;
            const response = await config.api.post("/api/v1/login", {
              accessToken,
              expiresIn,
              serviceName,
            });
            popup.close();
            resolve(response.data);
          } catch (error) {
            popup.close();
            reject(error);
          }
        }
      };
      window.addEventListener("message", onMessage);
      checkInterval = setInterval(() => {
        if (popup.closed) {
          if (settled) return;
          settled = true;
          cleanup();
          reject(new Error("OAuth popup closed before completing login"));
        }
      }, 1000);
    } else {
      throw new Error("Popup blocked");
    }
  });
};

export default loginWithRocketChatOAuth;
