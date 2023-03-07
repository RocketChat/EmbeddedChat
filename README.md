# EmbeddedChat

An easy to use full-stack component (ReactJS + backend behaviors) embedding Rocket.Chat into your webapp.

_EmbeddedChat is a full-stack React component node module of the RocketChat application that is fully configurable, extensible, and flexible for use. It is tightly bound with the RocketChat server using Rocket.Chat nodejs SDK and its UI using RocketChat's Fuselage Design System._

![embeddedchatwall](https://user-images.githubusercontent.com/73601258/178119162-ecabb9b7-e3ae-4c70-8ab2-f6c02856f4c6.png)

## Installation

```bash
npm i embeddedchat
```

## Usage

Just import the component,

```javascript
import { RCComponent } from 'embeddedchat';
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
  FACEBOOK_APP_ID={process.env.REACT_APP_FACEBOOK_APP_ID}
  FACEBOOK_APP_SECRET{process.env.REACT_APP_FACEBOOK_APP_SECRET}
  host={'http://localhost:3000'}
  roomId={'GENERAL'}
  channelName="Customer Service"
  anonymousMode={false}
  showAvatar={false}
  showRoles={false}
/>
```

## Props

Read this [wiki page](https://github.com/RocketChat/EmbeddedChat/wiki/Roots-of-EmbeddedChat) for more info on each prop.

| prop             | description                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| isClosable       | is the component closable?, defaults to `false`.                                                                                            |
| setClosableState | the reusable setState, which will track the opening and closing of EmbeddedChat. It is a `setState fn` => which toggles the previous state. |
| moreOpts         | it adds a kebab menu with added functionalities like showing pinned, starred, thread messages                                               |
| width            | `width` of the component                                                                                                                    |
| height           | `height` of the component (based on the `ChatBody`)                                                                                         |
| host             | your Rocket.Chat host domain, defaults to `http://localhost:3000` (the dev server)                                                          |
| GOOGLE_CLIENT_ID | The Google client ID you will receive after creating a project in Google console                                   |
| FACEBOOK_APP_ID  | The Facebook App ID you will receive after setting up Facebook OAuth |
| FACEBOOK_APP_SECRET|  The Facebook App Secret you will receive after setting up Facebook OAuth |
| roomId           | the public room's id that you want to subscribe to                                                                                          |
| channelName      | the fallback channel name to be present on the chat header                                                                                  |
| anonymousMode    | if the user can see the chat without logging in                                                                                             |
| showAvatar       | show the user's avatar in the chat component, defaults to false                                                                             |
| showRoles        | show the user's roles in the chat component, defaults to false                                                                              |

## To setup OAuth for EmbeddedChat, follow these steps:

Google OAuth: Visit this [link](https://docs.rocket.chat/use-rocket.chat/rocket.chat-workspace-administration/settings/oauth/google-oauth-setup) for instructions on how to receive the `GOOGLE_CLIENT_ID` and set up Google SSO for EmbeddedChat.

Facebook OAuth: Visit this [link](https://docs.rocket.chat/use-rocket.chat/rocket.chat-workspace-administration/settings/oauth/facebook-oauth-setup) for instructions on how to receive the `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET` as well as to set up Facebook OAuth for EmbeddedChat.

> **Development with Facebook OAuth:**  When using Facebook OAuth in a development environment, it is important to note that Facebook does not allow HTTP connections. As a result, you must use HTTPS when testing Facebook OAuth in a development environment.

To ensure HTTPS is enabled for your development environment, add the following line to your package.json file:

```
"dev": "HTTPS=true concurrently \" npm run watch \" \" npm run start --prefix playground \"",

```

## Development

<h3>Local Setup</h3>

```bash
npm i
cd playground && npm i
npm run dev # at the root folder --> EMBEDDEDCHAT

```

It will open up a playground react app at `http://localhost:4000`.
Make a `.env` file in the playground directory following the `.env[example]` file.

<h3>Gitpod Setup</h3>

Make a `.env` file in the playground directory following the `.env[example]` file.

<a href="https://gitpod.io/#https://github.com/RocketChat/EmbeddedChat">
  <img
    src="https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?logo=gitpod"
    alt="Contribute with Gitpod"
  />
</a>
