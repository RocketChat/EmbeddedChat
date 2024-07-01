### Authentication

The `EmbeddedChat` component offers three distinct authentication modes to cater to different requirements for accessing RocketChat. Below is a detailed guide on how to implement each authentication flow.

#### 1. Token Authentication Flow

Token authentication allows users to authenticate using a service-specific access token. There are two ways to use token authentication:

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

In both cases, the credentials are posted to the `/api/v1/login` endpoint of the RocketChat server.

#### 2. Password Authentication Flow

The password method displays a modal where users can enter their username and password:

```javascript
auth: {
  flow: 'PASSWORD',
}
```

This method is straightforward and does not require additional configuration for the `auth` prop. When this flow is active, a modal dialog prompts users for their RocketChat username and password.

#### 3. OAuth Authentication Flow

To use RocketChat's OAuth authentication, ensure the EmbeddedChat app is installed and configured on your RocketChat server:

```javascript
auth: {
  flow: 'OAUTH',
}
```

This method utilizes the OAuth configuration set up in RocketChat, providing a seamless authentication experience.

### Integrating with EmbeddedChat

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
