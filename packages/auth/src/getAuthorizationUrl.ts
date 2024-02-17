const getAuthorizationUrl = (oauthService: any) => {
  if (oauthService.authorizePath?.startsWith("http")) {
    return oauthService.authorizePath;
  }
  if (oauthService.serverURL) {
    return new URL(
      oauthService.authorizePath,
      oauthService.serverURL
    ).toString();
  } else {
    return oauthService.authorizePath;
  }
};

export default getAuthorizationUrl;
