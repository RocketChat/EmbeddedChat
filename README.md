# EmbeddedChat

An easy to use full-stack component (ReactJS + backend behaviors) embedding Rocket.Chat into your webapp.

*EmbeddedChat is a full-stack React component node module of the RocketChat application that is fully configurable, extensible, and flexible for use. It is tightly bound with the RocketChat server using Rocket.Chat nodejs SDK and its UI using RocketChat's Fuselage Design System.*

![embeddedchatwall](https://user-images.githubusercontent.com/73601258/178119162-ecabb9b7-e3ae-4c70-8ab2-f6c02856f4c6.png)

## Installation

```bash
npm i embeddedchat
```

## Usage

Just import the component,

```javascript
import  { RCComponent }  from  "embeddedchat";
```

and use it,

```jsx
<RCComponent
  isClosable={true}
  setClosableState={setClosableState}
  moreOpts={true}
  width="100%"
  height="40vh"
  GOOGLE_CLIENT_ID={process.env.REACT_APP_GOOGLE_CLIENT_ID}
  host={'http://localhost:3000'}
  roomId={'GENERAL'}
  channelName="Customer Service"
  anonymousMode={false}
/>
```

## Props

Read this [wiki page](https://github.com/RocketChat/EmbeddedChat/wiki/Roots-of-EmbeddedChat) for more info on each prop.

|prop|description  |
|--|--|
|isClosable  | is the component closable?, defaults to `false`. |
|setClosableState | the reusable setState, which will track the opening and closing of EmbeddedChat. It is a `setState fn` => which toggles the previous state.|
|moreOpts | it adds a kebab menu with added functionalities like showing pinned, starred, thread messages |
| width| `width` of the component|
| height| `height` of the component (based on the `ChatBody`) |
|host | your Rocket.Chat host domain, defaults to `http://localhost:3000` (the dev server)|
|GOOGLE_CLIENT_ID | it is the google client id that you will receive after creating a project in google console|
|roomId | the public room's id that you want to subscribe to|
|channelName| the fallback channel name to be present on the chat header|
|anonymousMode | if the user can see the chat without logging in|

## Setting up Authentication

Follow this [documentation](https://docs.rocket.chat/guides/administration/admin-panel/settings/oauth/google-oauth-setup) to receive the `GOOGLE_CLIENT_ID` as well as to setup Google SSO for EmbeddedChat.

> Note: You need to disable TOTP for this to work!

## Development

For development,

```bash
npm i
cd playground && npm i
npm run dev # at root
```

It will open up a playground react app at `http://localhost:4000`.
Make a `.env` file in the playground directory following the `.env[example]` file.

---

## Differences between EmbeddedChat and iFrame

EmbeddedChat  | iFrame
----------|----------
  **Embedded chat** is a feature that allows you to easily add a chat widget to your website or web application. It is typically implemented using a full-stack component, such as ReactJS, and may include both front-end and back-end behaviors.  | **iFrame** is an HTML element that allows you to embed one web page within another. This allows users to interact with the chat platform as if they were on the chat platform's site, while remaining on your site.
**Features:** Embedded chat may offer a wide range of features, such as group and direct messaging, audio and integrations with other tools and services       | *iFrame* on the other hand, may be more limited in terms of features, as it is simply displaying another website within a frame on your site.
| **One channel vs. multichannel:** Embedded chat widgets may allow users to participate in multiple channels or conversations                                                                                                                     | *iFrames* may only allow users to interact with a single channel or conversation at a time.
| **UI improvements:** Embedded Chat may offer more flexibility in terms of UI improvements, as it is provided by the chat platform and can be customized to some extent                                                                           | An *iFrame* may be more limited in terms of UI improvements, as it is simply displaying another website within a frame on your site.  
 **Usecases:** Embedded Chat may be well-suited for use cases such as customer support, online communities, and team communication, |*iFrame* may be more suitable for displaying content from another website within your site.
 **Demo deploy:** [EmbeddedChat](https://sidmohanty11.github.io/embeddedchat-demo-deploy/) | [iFrame](https://sidmohanty11.github.io/embeddedchat-iframe-deploy/)
