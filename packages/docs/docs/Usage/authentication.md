---
title: Authentication Guide
---
# Authentication Guide

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)


### Various methods for enabling login functionality

The `EmbeddedChat` component offers three distinct authentication modes to cater to different requirements for accessing Rocket.Chat. Below is a detailed guide on how to implement each authentication flow.

#### 1. Token Authentication Flow

Token authentication allows users to authenticate using a service-specific access token or personal access token (resume-token). This method is typically used for automatic user login without requiring login credentials or for managing the authentication process internally. The two ways to use token authentication are:

##### a. Using `accessToken` and `expiresIn`:

```javascript
auth: {
  flow: 'TOKEN',
  credentials: {
    serviceName: "your-service-name",
    accessToken: "accessToken",
    expiresIn: 3600,
  },
}
```

- `serviceName`: The name of your authentication service.
- `accessToken`: The access token obtained from your authentication service.
- `expiresIn`: The duration in seconds for which the token is valid.

##### b. Using `resume`:

```javascript
auth: {
  flow: 'TOKEN',
  credentials: {
    resume: 'resumeToken',
  },
}
```

- `resume`: A resume token to be used for authentication.

To obtain the resume token, navigate to your profile settings in Rocket.Chat. Then, go to Personal Access Token and click ADD. You will get a personal access token which you can use here to facilitate auto-login with a test user.

In both cases, the credentials are posted to the `/api/v1/login` endpoint of the RocketChat server.

#### 2. Password Authentication Flow

By default, EmbeddedChat utilizes the 'PASSWORD' flow, where a modal prompts users to enter their credentials for login.

```javascript
auth: {
  flow: 'PASSWORD',
}
```

This method is straightforward and requires no additional configuration for the `auth` prop. When this flow is active, users are prompted with a modal dialog to input their RocketChat username and password.

#### 3. OAuth Authentication Flow

EmbeddedChat also offers OAuth login functionality through OAuth configuration set up in Rocket.Chat. This authentication flow can only be utilized if the EmbeddedChat RC app is installed and configured properly on your Rocket.Chat server:

```javascript
auth: {
  flow: 'OAUTH',
}
```

This method leverages the OAuth configuration established in Rocket.Chat, ensuring a streamlined authentication process.

For instructions on installing the EmbeddedChat RC app on your Rocket.Chat server, refer to the [EmbeddedChat RC App installation guide](../Usage/ec_rc_setup.md).

Certainly! Here are the instructions to enable OAuth login in the EmbeddedChat RC app, without using sub-bullets:

#### Steps to Enable OAuth Login in EmbeddedChat RC App

1. Copy Callback URL:
   Navigate to the settings of your EmbeddedChat RC app. Locate the Callback URL and copy it.

2. Configure Third-Party Login:
   Access your Rocket.Chat workspace. Navigate to the Third-Party Login settings. Click on New Application, provide a suitable name, and paste the copied Callback URL. Obtain the client ID and secret for this application, then activate it.

3. Update EmbeddedChat RC App Settings:
   Return to the settings of your EmbeddedChat RC app. Paste the obtained client ID and secret into the respective fields. Save the updated settings.

4. Creating Custom OAuth:
  Navigate to Workspace Settings > OAuth within your Rocket.Chat workspace. Here, create a new custom OAuth configuration with a suitable name, and configure it as follows:

    - URL: http://your-rocket-chat-server-url/api/v1
    - Token sent via: Payload
    - Login style: Popup
    - Enable: Merge Users and Merge users from distinct services.
    - Disable: Show Button on Login Page.

5. Finalize EmbeddedChat RC App Configuration:
   Go back to the settings of your EmbeddedChat RC app. Enter the lowercase name of your custom OAuth configuration. Save the settings to apply the OAuth integration.

6. Enable OAuth Login for Users:
   By default, only administrators can use OAuth login. To enable OAuth login for all users, navigate to Wokspace > Permissions, search for manage OAuth apps permission, and grant it to the desired user roles.

Following these steps will successfully enable OAuth login in the EmbeddedChat RC app, integrating it with your Rocket.Chat workspace for streamlined user authentication.

A video demonstration can also be found below to assist in successfully enabling this in your workspace:

[Watch the video demonstration](https://github.com/RocketChat/EmbeddedChat/assets/78961432/cc77d84a-f818-4e16-9e44-bd489f64cf22)

## Storing the `ec-token` for automatic login

Currently, EmbeddedChat supports two modes for enabling auto-login. After the user completes the login process, the Rocket.chat server returns a token referred to as `ec-token`. This token can be saved in two ways:

1. Storing in Local Storage: By default, the `ec-token` is stored in local storage. Upon initial loading, if an `ec-token` is found in local storage, it triggers auto login and manages subsequent actions accordingly.

2. Storing as HTTP-Only Cookie: By setting the `secure` prop to true, the `ec-token` can be stored as an HTTP-only cookie. This approach enhances security by preventing JavaScript access to the token. Note that this feature requires the EmbeddedChat RC app to be installed on the server.

    Here’s a concise explanation of how it operates: after logging in, the token is transferred to the EmbeddedChat RC app, where it is set as an HTTP-only cookie. During auto-login, EmbeddedChat makes a request that includes cookies managed by the browser to the RC app endpoint. The RC app retrieves the token and sends it back, which EmbeddedChat then forwards to the `/api/v1/login` endpoint of the Rocket.chat server for authentication. This functionality is fully integrated into the EmbeddedChat app, presented here for technical insight.

## Integrating with EmbeddedChat

When integrating any of these authentication methods into `EmbeddedChat`, ensure to include the `auth` prop containing the desired configuration, and set the `secure` prop to true to activate the HTTP-Only cookie.

```jsx
<EmbeddedChat
  host="http://your-rocketchat-server.com"
  roomId="YOUR_ROOM_ID"
  auth={{
    flow: 'TOKEN', // or 'PASSWORD' or 'OAUTH'
    credentials: {
      // Include if using TOKEN flow
    },
    secure: true // or false
  }}
/>
```

Ensure that the `host` and `roomId` props are set according to your RocketChat server and the specific room you want to connect to.