<h1>Embedded Chat: A staple in excellent customer service</h1>

An easy-to-use, full-stack component (React.js + backend behaviors) for embedding Rocket.Chat into your web app.

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)


## Authentication

The `EmbeddedChat` component offers three distinct authentication modes to cater to different requirements for accessing RocketChat. Below is a detailed guide on how to implement each authentication flow.

### 1. Token Authentication Flow

Token authentication allows users to authenticate using a service-specific access token or personal access token (resume-token). This method is typically used for automatic user login without requiring login credentials or for managing the authentication process internally. The two ways to use token authentication are:

#### a. Using `accessToken` and `expiresIn`:

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

#### b. Using `resume`:

```javascript
auth: {
  flow: 'TOKEN',
  credentials: {
    resume: 'resumeToken',
  },
}
```

- `resume`: A resume token to be used for authentication.

To obtain the resume token, navigate to your profile settings in Rocket.Chat, then go to Personal Access Token and click ADD.

In both cases, the credentials are posted to the `/api/v1/login` endpoint of the RocketChat server.

### 2. Password Authentication Flow

By default, EmbeddedChat utilizes the 'PASSWORD' flow, where a modal prompts users to enter their credentials for login.

```javascript
auth: {
  flow: 'PASSWORD',
}
```

This method is straightforward and requires no additional configuration for the `auth` prop. When this flow is active, users are prompted with a modal dialog to input their RocketChat username and password.

### 3. OAuth Authentication Flow

EmbeddedChat also offers OAuth login functionality through OAuth configuration set up in Rocket.Chat. This authentication flow can only be utilized if the EmbeddedChat RC app is installed and configured properly on your Rocket.Chat server:

```javascript
auth: {
  flow: 'OAUTH',
}
```

This method leverages the OAuth configuration established in Rocket.Chat, ensuring a streamlined authentication process.

For instructions on installing the EmbeddedChat RC app on your Rocket.Chat server, refer to the [EmbeddedChat RC App installation guide](../../rc-app/README.md).

## Integrating with EmbeddedChat

When implementing any of these authentication methods in `EmbeddedChat`, include the `auth` prop with the desired configuration:

```jsx
<EmbeddedChat
  host="http://your-rocketchat-server.com"
  roomId="YOUR_ROOM_ID"
  auth={{
    flow: 'TOKEN', // or 'PASSWORD' or 'OAUTH'
    credentials: {
      // Include if using TOKEN flow
    },
  }}
/>
```

Ensure that the `host` and `roomId` props are set according to your RocketChat server and the specific room you want to connect to.
