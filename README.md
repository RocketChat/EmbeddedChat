# EmbeddedChat

An easy to use full-stack component (ReactJS + backend behaviors) embedding Rocket.Chat into your webapp.

_EmbeddedChat is a full-stack React component node module of the RocketChat application that is fully configurable, extensible, and flexible for use. It is tightly bound with the RocketChat server using Rocket.Chat nodejs SDK and its UI using RocketChat's Fuselage Design System._

![embeddedchatwall](https://user-images.githubusercontent.com/73601258/178119162-ecabb9b7-e3ae-4c70-8ab2-f6c02856f4c6.png)

<div align='center' width='100%'>
<a href="https://github.com/monoclehq">
<img src="https://open-source-assets.middlewarehq.com/svgs/RocketChat-EmbeddedChat-contributor-metrics-dark-widget.svg?caching=true"></img>
</a>
</div>

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
| GOOGLE_CLIENT_ID | it is the google client id that you will receive after creating a project in google console                                                 |
| roomId           | the public room's id that you want to subscribe to                                                                                          |
| channelName      | the fallback channel name to be present on the chat header                                                                                  |
| anonymousMode    | if the user can see the chat without logging in                                                                                             |
| showAvatar       | show the user's avatar in the chat component, defaults to false                                                                             |
| showRoles        | show the user's roles in the chat component, defaults to false                                                                              |
| enableThreads    | enable RocketChat's style thread messages, defaults to false                                                                             |
## Development

### Local Setup
To run the embeddedchat, you will need a *Rocket.Chat* server running (development or production). To setup Rocket.Chat dev environment follow this guide.
[https://github.com/RocketChat/Rocket.Chat#%EF%B8%8F-local-development](https://github.com/RocketChat/Rocket.Chat#%EF%B8%8F-local-development)

#### Prerequisites

Ensure you have Node.js version 16.19.0 installed. We recommend using [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) to manage your Node.js versions.

To use the correct Node.js version for this project, run the following command:

```bash
nvm install
nvm use
``` 

We use yarn workspaces. Install yarn if not already installed.

#### Install dependencies

```bash
yarn
```

Thats all, This will install all the dependencies and will then build our auth, api and react package.

#### Starting auth dev environment
```bash
cd packages/auth
yarn dev
```

#### Starting api dev environment
```bash
cd packages/api
yarn dev
```
Api package depends on auth package. If you make any change to auth package, build the package using `yarn build` in `package/auth` directory. Then, restart the api dev environment.

#### Starting react dev environment
```bash
cd packages/react
yarn storybook
```
React package depends on api package. If you make any change to api package, build the package using `yarn build` in `package/api` directory. Then, restart the react dev environment.
