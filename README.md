# EmbeddedChat

An easy to use full-stack component (ReactJS + backend behaviors) embedding Rocket.Chat into your webapp.

_EmbeddedChat is a full-stack React component node module of the RocketChat application that is fully configurable, extensible, and flexible for use. It is tightly bound with the RocketChat server using Rocket.Chat nodejs SDK and its UI using RocketChat's Fuselage Design System._

![embeddedchatwall](https://user-images.githubusercontent.com/73601258/178119162-ecabb9b7-e3ae-4c70-8ab2-f6c02856f4c6.png)

<div align='center' width='100%'>
<a href="https://github.com/monoclehq">
<img src="https://open-source-assets.middlewarehq.com/svgs/RocketChat-EmbeddedChat-contributor-metrics-dark-widget.svg?caching=true"></img>
</a>
</div>

## Wiki and FAQs
Check out our [Wiki](https://github.com/RocketChat/EmbeddedChat/wiki) and [FAQ](https://github.com/RocketChat/EmbeddedChat/wiki/FAQs) page for in-depth guides and answers to common questions. Whether you're a newbie or an expert, you'll find valuable insights to enhance your experience.

![image](https://github.com/coderboy-yash/EmbeddedChat/assets/109899959/af6ea4b4-8499-4f9d-aa83-56c2cf8123c8)

## Understanding the Internals
For those of you who love diving into the technical details, we have a [Roots of EmbeddedChat wiki](https://github.com/RocketChat/EmbeddedChat/wiki/Roots-of-EmbeddedChat) that delves into the project's internals. Gain a deeper understanding of how everything works behind the scenes and unlock the full potential of the project.

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
| enableThreads    | enable RocketChat's style thread messages, defaults to false                                                                                |
| headerColor    |  sets the background color of the chat header, providing visual customization.|
| toastBarPosition     |  defines where the toast bar appears in the chat interface, allowing you to control its position for better user experience.|

## Setting up Authentication

Follow this [documentation](https://docs.rocket.chat/guides/administration/admin-panel/settings/oauth/google-oauth-setup) to receive the `GOOGLE_CLIENT_ID` as well as to setup Google SSO for EmbeddedChat.

## Development

<h3>Local Setup</h3>

```bash
npm i
cd playground && npm i
npm run dev # at the root folder --> EMBEDDEDCHAT

```



It will open up a playground react app at `http://localhost:4000`.
Make a `.env` file in the playground directory following the `.env[example]` file.
### Setup for `Windows` user

Above command might not work if you are a `Windows`user because in package.json the scripts are written according to Linux environment so do these steps :-
```bash
step 1:- clone the forked repo in your vs code
step 2:- go to EmbeddedChat -> package.json
         change 
                "scripts":{
                 "build": "NODE_ENV=development rollup -c --context=window",
            "build:prod": "NODE_ENV=production rollup -c --context=window",
         } 
         to ------>
                "scripts":{
                    "build": "set NODE_ENV=development && rollup -c --context=window",
               "build:prod": "set NODE_ENV=production && rollup -c --context=window",
                
                }
step 3:- go to embeddedChat -> playground->package.json
         change 
                "scripts":{
                 "start": "PORT=4000 node ../node_modules/react-scripts/bin/react-scripts.js start",
         }
         to ------>
                "scripts":{
                 "start": " set PORT=4000 && node ../node_modules/react-scripts/bin/react-scripts.js start",
                }


         
```
### note
if `npm i` gives error try `npm i --legacy-peer`and error might be solved.

<h3>Gitpod Setup</h3>

Make a `.env` file in the playground directory following the `.env[example]` file.



<a href="https://gitpod.io/#https://github.com/RocketChat/EmbeddedChat">
  <img
    src="https://img.shields.io/badge/Contribute%20with-Gitpod-908a85?logo=gitpod"
    alt="Contribute with Gitpod"
  />
</a>
