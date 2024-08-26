# Embedded Chat: A staple in excellent customer service

An easy-to-use, full-stack component (React.js + backend behaviors) for embedding Rocket.Chat into your web app.

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)


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

## Props

EmbeddedChat supports various props that are used to customize different aspects of this component. A brief description of all the supported props is listed as follows:

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

## Understanding Prop Functionality

This section of the guide aims to provide a detailed explanation of these props. However, props such as `width`, `height`, `host`, `channelName`, `showRoles`, `showAvatar`, `showUsername`, `showName`, `className`, `style`, `hideHeader`, and `dark` are straightforward and will not receive detailed discussion here.

- ### Managing the Closable State

  When integrating EmbeddedChat, developers have the flexibility to control its visibility. They can utilize their internal state management to achieve this. EmbeddedChat supports a function to manage this state and provides a close icon for executing the close functionality.

  To enable the closable feature, set `isClosable` to `true` and provide a `setClosableState` function to handle the open and close states of the chat window.

  ```jsx
  <EmbeddedChat
    isClosable={true}
    setClosableState={handleClose}
    // ...other props
  />
  ```

  This setup allows seamless integration of EmbeddedChat with custom control over its visibility.

- ### Obtaining Room ID

  By default, EmbeddedChat uses the 'GENERAL' channel as its default channel in a Rocket.Chat server. However, EmbeddedChat can be integrated into any channel within your workspace, provided you have the roomId of the desired room. To retrieve the roomId for your specified room, execute the following curl command. This API call accepts the roomName parameter and returns detailed information about the room, including its unique ID:

  ```bash
  curl --request GET \
    --url 'http://your-rocketchat-server.com/api/v1/rooms.info?roomName=channelName' \
    --header 'X-Auth-Token: auth-token' \
    --header 'X-User-Id: user-id' \
    --header 'accept: application/json'
  ```

  For a comprehensive guide on retrieving room information, consult the Rocket.Chat API documentation: [Get Room Information](https://developer.rocket.chat/apidocs/get-room-information).

  Once you obtain the roomId, provide it as the value for the `roomId` prop to connect to the corresponding room.

  ```jsx
  <EmbeddedChat
    roomId="YOUR_ROOM_ID"
    // ...other props
  />
  ```

- ### Anonymous Mode

  Rocket.Chat allows users to view messages in read-only mode without logging in. This setting can be enabled by navigating to Workspace settings > Accounts > Allow Anonymous Read. Once this setting is activated, EmbeddedChat can also display channel messages in read-only mode without requiring a login. To enable this feature, pass `anonymousMode` as true in the props.

  ```jsx
  <EmbeddedChat
    anonymousMode={true}
    // ...other props
  />
  ```

- ### Enabling Threads

  Threads allow users to discuss a specific message separately, preventing the main channel from being cluttered with numerous messages and providing a dedicated space for focused discussions. By default, this setting is enabled, but it can be disabled by passing `enableThreads` as false.

  ```jsx
  <EmbeddedChat
    enableThreads={false}
    // ...other props
  />
  ```

- ### Theming and Customization

  EmbeddedChat supports various design variants, style overrides, and many other customization features. To tailor it to your needs, you can pass a `theme` object to customize the appearance according to your application's design:

  ```jsx
  <EmbeddedChat
    // ...other props
    theme={myCustomTheme}
  />
  ```

  However, the `theme` object must follow a specific format. For detailed information on theming EmbeddedChat, refer to [theming.md](https://rocketchat.github.io/EmbeddedChat/docs/docs/Usage/theming).

  In Storybook, demonstrations of different themes and variants are provided in the 'Design Variants' section.

- ### Authentication Guide

  Embedded Chat supports various methods for logging into a Rocket.Chat server. These include three primary methods:

  1. **Token-Based Authentication**: This can be either a personal access token or a service-specific access token.
  2. **Login Credentials**: Using a valid username/email and password.
  3. **OAuth Authentication**: Uses the OAuth configuration set up in Rocket.Chat. [This method requires installing the EmbeddedChat RC App on the Rocket.Chat server]

  #### Storing the `ec-token` for Auto Login

  After completing the login, a resume token, referred to as `ec-token`, is used for auto login. There are currently two supported methods to store this token:

  1. **Local Storage**: Store the `ec-token` in the browser's local storage.
  2. **HTTP-Only Cookie**: Store the `ec-token` as an HTTP-only cookie. [This method requires the installation of the EmbeddedChat RC App on the Rocket.Chat server]

  For a detailed guide on using each of these authentication methods with the `auth` and `secure` props, refer to the [authentication guide](../docs/authentication.md) file.

## Development

Follow this [development guide](https://rocketchat.github.io/EmbeddedChat/docs/docs/Development/dev_launch) to setup EmbeddedChat for development.

## Conclusion

The `EmbeddedChat` component offers a flexible and feature-rich solution for integrating RocketChat into your application. Customize it according to your needs to enhance your app's chat functionality.
