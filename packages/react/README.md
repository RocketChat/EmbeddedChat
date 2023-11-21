# EmbeddedChat

An easy to use full-stack component embedding Rocket.Chat into your webapp.

_EmbeddedChat is a full-stack React component node module of the RocketChat application that is fully configurable, extensible, and flexible for use. It is tightly bound with the RocketChat server using Rocket.Chat nodejs SDK and its UI fully customisable._

![embeddedchatwall](https://user-images.githubusercontent.com/73601258/178119162-ecabb9b7-e3ae-4c70-8ab2-f6c02856f4c6.png)

<div align='center' width='100%'>
<a href="https://github.com/monoclehq">
<img src="https://open-source-assets.middlewarehq.com/svgs/RocketChat-EmbeddedChat-contributor-metrics-dark-widget.svg?caching=true"></img>
</a>
</div>

## Installation
```bash
npm install @embeddedchat/react
# or
yarn add @embeddedchat/react
```

## Importing the Component

Import the `EmbeddedChat` component into your file:

```javascript
import { EmbeddedChat } from '@embeddedchat/react';
```

## Basic Usage

To use the `EmbeddedChat` component, include it in your component's render method or return statement. Here's a basic example:

```jsx
<EmbeddedChat
  host="http://your-rocketchat-server.com"
  roomId="YOUR_ROOM_ID"
/>
```

### Props

- `isClosable` (boolean): If `true`, the chat window can be closed. Defaults to `false`.
- `setClosableState` (function): Callback to handle the closable state.
- `moreOpts` (boolean): It adds a kebab menu with added functionalities like showing pinned, starred, thread messages. Defaults to `false`.
- `width` (string): Width of the chat window. Defaults to `'100%'`.
- `height` (string): Height of the chat window. Defaults to `'50vh'`.
- `host` (string): The URL of your RocketChat server.
- `roomId` (string): ID of the chat room.
- `channelName` (string): The fallback channel name to be present on the chat.
- `anonymousMode` (boolean): Enable anonymous mode. Defaults to `false`.
- `toastBarPosition` (string): Position of the toast bar. Defaults to `'bottom right'`.
- `showRoles` (boolean): Display user roles. Defaults to `false`.
- `showAvatar` (boolean): Show user avatars. Defaults to `false`.
- `enableThreads` (boolean): Enable chat threads. Defaults to `false`.
- `theme` (object): Theme object for styling.
- `className` (string): Additional CSS class for styling.
- `style` (object): Inline styles for the chat window.
- `hideHeader` (boolean): Hide the chat header. Defaults to `false`.
- `auth` (object): Authentication configuration.

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

## Theming and Customization

You can pass a `theme` object to customize the appearance according to your application's design:

```jsx
<EmbeddedChat
  // ...other props
  theme={myCustomTheme}
/>
```
Follow [theming.md](docs/theming.md) to know more about EmbeddedChat's theming.

## Handling the Closable State

If `isClosable` is `true`, provide a `setClosableState` function to manage the state when the chat window is closed:

```jsx
<EmbeddedChat
  isClosable={true}
  setClosableState={handleClose}
  // ...other props
/>
```

## Development
Follow this [EmbeddedChat Readme](https://github.com/RocketChat/EmbeddedChat) to setup EmbeddedChat for development.

## Conclusion

The `EmbeddedChat` component offers a flexible and feature-rich solution for integrating RocketChat into your application. Customize it according to your needs to enhance your app's chat functionality.

