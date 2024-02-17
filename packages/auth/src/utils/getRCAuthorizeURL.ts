export const getRCAuthorizeURL = (
  host: string,
  redirectUri: string,
  clientId: string
) => {
  const url = new URL(`oauth/authorize`, host);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", encodeURIComponent(window.location.origin));
  return url.toString();
};
