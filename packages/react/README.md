<h1 align='center'>Embedded Chat: A staple in excellent customer service</h1>

![image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/574be6b4-d2f7-4bea-a7b1-4c6e840d8e22)

An easy-to-use, full-stack component (React.js + backend behaviors) for embedding Rocket.Chat into your web app.

_EmbeddedChat is a full-stack React component designed to integrate Rocket.Chat into your web app. It is fully configurable, extensible, and flexible, offering various preconfigured designs, multiple login options, and more. The component is tightly integrated with the Rocket.Chat server using the Rocket.Chat SDK, and its entire UI is built using custom components._

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)

<div align='center' width='100%'>
<a href="https://github.com/RocketChat/EmbeddedChat/graphs/contributors">
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
<EmbeddedChat host="http://your-rocketchat-server.com" roomId="YOUR_ROOM_ID" />
```

### Props

- `isClosable` (boolean): If `true`, the chat window can be closed. Defaults to `false`.
- `setClosableState` (function): Callback for handling the closable state.
- `width` (string): Width of the chat window. Defaults to `'100%'`.
- `height` (string): Height of the chat window. Defaults to `'95vh'`.
- `host` (string): URL of your RocketChat server.
- `roomId` (string): ID of the chat room. Defaults to `GENERAL`.
- `channelName` (string): Fallback channel name for the chat. Defaults to `general`.
- `anonymousMode` (boolean): Enables anonymous mode. Defaults to `false`.
- `toastBarPosition` (string): Position of the toast bar. Defaults to `'bottom right'`.
- `showRoles` (boolean): Displays user roles. Defaults to `false`.
- `showAvatar` (boolean): Shows user avatars. Defaults to `true`.
- `showUsername` (boolean): Displays the user's username. Defaults to `false`.
- `showName` (boolean): Displays the user's name. Defaults to `true`.
- `enableThreads` (boolean): Enables chat threads. Defaults to `false`.
- `theme` (object): Theme object for styling.
- `className` (string): Additional CSS class for styling.
- `style` (object): Inline styles for the chat window.
- `hideHeader` (boolean): Hides the chat header. Defaults to `false`.
- `auth` (object): Authentication configuration.
- `secure` (boolean): Uses HTTP-only cookies for authentication. Defaults to `false`.
- `dark` (boolean): Enables dark mode in the application. Defaults to `false`.
- `remoteOpt` (boolean): Allows props override remotely using `EmbeddedChat RC App`. Defaults to `false`.

## Handling the Closable State

If `isClosable` is `true`, provide a `setClosableState` function to manage the state when the chat window is closed:

```jsx
<EmbeddedChat
  isClosable={true}
  setClosableState={handleClose}
  // ...other props
/>
```

## Authentication Guide

Embedded Chat supports various methods for logging into a Rocket.Chat server. These include three primary methods:

1. **Token-Based Authentication**: This can be either a personal access token or a service-specific access token.
2. **Login Credentials**: Using a valid username/email and password.
3. **OAuth Authentication**: Uses the OAuth configuration set up in Rocket.Chat. [This method requires installing the EmbeddedChat RC App on the Rocket.Chat server]

#### Storing the `ec-token` for Auto Login

After completing the login, a `resume-token / ec-token` is used for automatic login. There are two methods to store this token :

1. **Local Storage**: Store the `ec-token` in the browser's local storage.
2. **HTTP-Only Cookie**: Store the `ec-token` as an HTTP-only cookie. [This method requires the installation of the EmbeddedChat RC App on the Rocket.Chat server]

For a detailed description of how to work with each of these authentication methods, refer to the [authentication.md](docs/authentication.md) file.

## Theming and Customization

You can pass a `theme` object to customize the appearance according to your application's design:

```jsx
<EmbeddedChat
  // ...other props
  theme={myCustomTheme}
/>
```

Follow [theming.md](docs/theming.md) to know more about EmbeddedChat's theming.

## Development

Follow this [EmbeddedChat Readme](https://github.com/RocketChat/EmbeddedChat) to setup EmbeddedChat for development.

## Conclusion

The `EmbeddedChat` component offers a flexible and feature-rich solution for integrating RocketChat into your application. Customize it according to your needs to enhance your app's chat functionality.
