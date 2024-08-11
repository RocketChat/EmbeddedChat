# Google Summer of Code 2023, RocketChat

<div>
    <a href="https://summerofcode.withgoogle.com/projects/#6521788818784256"><img src="https://i.imgur.com/pgkUceb.png" width="650" alt="google-summer-of-code" /></a>
    <br />
    <b> 
        <p>
        Create a ready-to-go easy to embed mini-chat React component.
        </p>
    </b>
</div>

I worked on a project called [EmbeddedChat](https://github.com/RocketChat/EmbeddedChat) which is an in-app chat solution that utilizes the RocketChat chat engine through its REST and real-time APIs to support powerful chat features like reactions, online presence, typing status, threads, and much more.

I would maintain this repository as the final report summary of my GSoC 2023 project and a quick guide for all future GSoC aspirants.

## ⭐ Project Abstract
The goal of the project is to make a ready-to-use chat solution that could be integrated into any website, web app, or app. This project was a major refactoring and enhancement for the EmbeddedChat 2022 project.

## 🚢 Deliverables
- Improve authentication - support all OAuth services
- Move to a mono repo - auth, api, react, react-native, HTML embed
- HTML embed feature
- Theming
- Improving API
- Support for slash commands
- Migrating from the fuselage to our own minimal components

## Demo

### Sneak Peak
EmbeddedChat integrated into my esportsweb.in website.
![EmbeddedChat Reac component](https://github.com/abhinavkrin/GSoC-RocketChat-2023/assets/15830206/e42fd503-c7f7-4f30-abbb-9123d9c87257)


### Moving to mono repo
EmbeddedChat's new mono repo structure
![structure](https://github.com/abhinavkrin/GSoC-RocketChat-2023/assets/15830206/ae7593e1-5479-465a-ab9a-e73c6ee85cd6)

- *auth* - The auth package includes functions to easily log into a Rocket chat server. Though it is used by embeddedchat's react and react-native client, developers can use this package for their own use cases.
- *api* - The api package includes functions that are all required to create a chat application using the Rocketchat server. It has functions like connect, login, sendMesage, pinMessage, starMessage, deleteMessage, triggerBlockAction, etc. to perform various operations. One can listen to new/updated message events by attaching event listeners using `addMessageListener`. There are other event listeners which could be added using `addMessageDeleteListener`, `addTypingStatusListener`, `addActionTriggeredListener`, `addUiInteractionListener`.
- *react* - The react package includes the react components to integrate EmbeddedChat.
- *react-native* - The react-native project aims at using EmbeddedChat in react native mobile apps.
- *htmembed* - With this project EmbeddedChat could be integrated into any web app by simply embedding an HTML snippet.

### Storybook setup
![Screenshot from 2023-09-25 12-09-07](https://github.com/abhinavkrin/GSoC-RocketChat-2023/assets/15830206/5e7e6f05-6ead-4d3b-bb0e-22befacf3cf1)


### HTML Embedd Feature
Simple integrate embedded chat by pasting html snippet into your website
```
<div id="embeddedchat"></div>
      <script src="http://127.0.0.1:4001/embeddedchat.js"></script>
      <script>
        // all props for the EmbeddedChat of @embeddedchat/react will go here
		// The config will be directly applied as props for the EmbeddedChat Component
        const config = {
            host: 'http://localhost:3000',
    		roomId: 'GENERAL',
            isClosable: true,
            setClosableState: true,
            moreOpts: true,
            channelName: 'general',
            anonymousMode: true,
            headerColor: 'white',
            toastBarPosition: 'bottom-end',
            showRoles: true,
            showAvatar: false,
            enableThreads: true,
            auth: {
                flow: 'MANAGED',
            },
        }
        EmbeddedChat.renderInElementWithId(config, 'embeddedchat')
      </script>
```
HTML Embedded in action
![htmlembed](https://github.com/abhinavkrin/GSoC-RocketChat-2023/assets/15830206/8e803ef2-e4a0-48b9-a931-cb1e778d794d)


### Theming
We can customize EmbeddedChat by passing a custom theme object. Hence, it could take the look and feel of the app or website. We can also customize components by custom stylesheet or passing custom class names through the theme object.
![Customizing using theme](https://github.com/abhinavkrin/GSoC-RocketChat-2023/assets/15830206/96c191c5-a27f-4999-8fd4-96b0b5035493)


### Improving API
Our `api` package exposes the `EmbeddedChatApi` class. It comes with a bunch of APIs that could be used to login, send, pin, edit, star or delete message, attach listeners for realtime events. It has the following structure:
```
class EmbeddedChatApi {
    host: string;
    rid: string;
    rcClient: Rocketchat;
    onMessageCallbacks: ((message: any) => void)[];
    onMessageDeleteCallbacks: ((messageId: string) => void)[];
    onTypingStatusCallbacks: ((users: string[]) => void)[];
    onActionTriggeredCallbacks: ((data: any) => void)[];
    onUiInteractionCallbacks: ((data: any) => void)[];
    typingUsers: string[];
    auth: RocketChatAuth;
    constructor(host: string, rid: string, { getToken, saveToken, deleteToken, autoLogin }: IRocketChatAuthOptions);
    setAuth(auth: RocketChatAuth): void;
    getAuth(): RocketChatAuth;
    getHost(): string;
    googleSSOLogin(signIn: Function, acsCode: string): Promise<any>;
    login(userOrEmail: string, password: string, code: string): Promise<{
        status: string;
        me: any;
    } | undefined>;
    logout(): Promise<void>;
    connect(): Promise<void>;
    addMessageListener(callback: (message: any) => void): Promise<void>;
    removeMessageListener(callback: (message: any) => void): Promise<void>;
    addMessageDeleteListener(callback: (messageId: string) => void): Promise<void>;
    removeMessageDeleteListener(callback: (messageId: string) => void): Promise<void>;
    addTypingStatusListener(callback: (users: string[]) => void): Promise<void>;
    removeTypingStatusListener(callback: (users: string[]) => void): Promise<void>;
    addActionTriggeredListener(callback: (data: any) => void): Promise<void>;
    removeActionTriggeredListener(callback: (data: any) => void): Promise<void>;
    addUiInteractionListener(callback: (data: any) => void): Promise<void>;
    removeUiInteractionListener(callback: (data: any) => void): Promise<void>;
    handleTypingEvent({ typingUser, isTyping }: {
        typingUser: string;
        isTyping: boolean;
    }): void;
    updateUserNameThroughSuggestion(userid: string): Promise<any>;
    updateUserUsername(userid: string, username: string): Promise<any>;
    channelInfo(): Promise<any>;
    close(): Promise<void>;
    getMessages(anonymousMode?: boolean, options?: {
        query?: object | undefined;
        field?: object | undefined;
    }): Promise<any>;
    getThreadMessages(tmid: string): Promise<any>;
    getChannelRoles(): Promise<any>;
    sendTypingStatus(username: string, typing: boolean): Promise<void>;
    sendMessage(message: any, threadId: string): Promise<any>;
    deleteMessage(msgId: string): Promise<any>;
    updateMessage(msgId: string, text: string): Promise<any>;
    starMessage(mid: string): Promise<any>;
    unstarMessage(mid: string): Promise<any>;
    getStarredMessages(): Promise<any>;
    getPinnedMessages(): Promise<any>;
    pinMessage(mid: string): Promise<any>;
    unpinMessage(mid: string): Promise<any>;
    reactToMessage(emoji: string, messageId: string, shouldReact: string): Promise<any>;
    reportMessage(messageId: string, description: string): Promise<any>;
    findOrCreateInvite(): Promise<any>;
    sendAttachment(file: File, fileName: string, fileDescription?: string, threadId?: undefined): Promise<any>;
    me(): Promise<any>;
    getChannelMembers(): Promise<any>;
    getSearchMessages(text: string): Promise<any>;
    triggerBlockAction({ type, actionId, appId, rid, mid, viewId, container, ...rest }: any): Promise<any>;
    getCommandsList(): Promise<any>;
    execCommand({ command, params }: {
        command: string;
        params: string;
    }): Promise<any>;
}
```
Demo playgroud for api package
![playground_api](https://github.com/abhinavkrin/GSoC-RocketChat-2023/assets/15830206/af0952dd-d9de-4ab4-9a12-baaea9b19c6f)


### Support for slash commands
We have worked on supporting slash commands along with any UI interactions they perform.


https://github.com/abhinavkrin/GSoC-RocketChat-2023/assets/15830206/b4c0dd2e-e77f-49d5-8eb5-f27b1e011817

### React Native
![react native](https://github.com/abhinavkrin/GSoC-RocketChat-2023/assets/15830206/2d7e84cc-747d-4a23-acef-8a79363c12bd)


### Improving Auth
We now support token-based authentication for EmbeddedChat. An app can pass the access token of the services that are configured in RocketChat to EmbeddedChat. It would be useful when the app does not want to show any additional login UI for EmbeddedChat.


https://github.com/abhinavkrin/GSoC-RocketChat-2023/assets/15830206/8c36b974-927f-4b12-bd62-2830763ec681



## 🚀 Contributions
### Pull requests to Embeddedchat
| PR ID  | Title with Link                                        |
| --- | ----------------------------------------------------- |
| 217 | [IMPROVE] Project-restructure [Link](https://github.com/RocketChat/EmbeddedChat/pull/217) |
| 218 | React bootstrap [Link](https://github.com/RocketChat/EmbeddedChat/pull/218) |
| 222 | Theming Foundation Set up [Link](https://github.com/RocketChat/EmbeddedChat/pull/222) |
| 223 | [NEW] Button replacement for fuselage [Link](https://github.com/RocketChat/EmbeddedChat/pull/223) |
| 224 | UI refactoring/box [Link](https://github.com/RocketChat/EmbeddedChat/pull/224) |
| 226 | Improve/auth + ActionButton/Icon/Input Component [Link](https://github.com/RocketChat/EmbeddedChat/pull/226) |
| 227 | New/added apis [Link](https://github.com/RocketChat/EmbeddedChat/pull/227) |
| 228 | New/slash commands+UI kit+theming [Link](https://github.com/RocketChat/EmbeddedChat/pull/228) |
| 229 | New/html embed [Link](https://github.com/RocketChat/EmbeddedChat/pull/229) |
| 230 | New/message component+avatar [Link](https://github.com/RocketChat/EmbeddedChat/pull/230) |
| 232 | React Native Project [Link](https://github.com/RocketChat/EmbeddedChat/pull/232) |
| 233 | Fix/new icon components [Link](https://github.com/RocketChat/EmbeddedChat/pull/233) |

[View all PRs to EmbeddedChat](https://github.com/RocketChat/EmbeddedChat/pulls?q=is%3Apr+author%3Aabhinavkrin)

### My overall contributions to RocketChat
Besides EmbeddedChat I also contributed to other RocketChat Projects [GSoC Community Hub](https://github.com/RocketChat/GSoC-Community-Hub/pulls?q=is%3Apr+author%3Aabhinavkrin), [RC4Community](https://github.com/RocketChat/RC4Community/pulls?q=is%3Apr+author%3Aabhinavkrin), [RC4Conferences](https://github.com/RocketChat/RC4Conferences/pulls?q=is%3Apr+author%3Aabhinavkrin).

## 🎓 Mentor

A big big thank you to my mentor for the guidance and support before and throughout GSoC. 🙏 
I learned beyond GSoC from him and am forever grateful to be mentored by him.
- **Sidharth Mohanty** - [GitHub](https://github.com/sidmohanty11), [LinkedIn](https://www.linkedin.com/in/sidmohanty11/), [Twitter](https://twitter.com/sidmohanty11) 

## 🔗 Links

- Read my EmbeddedChat project proposal that got me accepted to GSoC [here](https://docs.google.com/document/d/1N6oySFsLxA9fSooTp8pHlCjnJwzVYfC8Cbems-z_uMY/edit?usp=sharing).

- My GSoC Presentation can be found [here](https://docs.google.com/presentation/d/1be7EnIjVjPN1vx11I06GeNqkDlWuynKZRKRYX9_ePOA/edit?usp=sharing).

- Watch the above presentation in video - [here](https://www.youtube.com/watch?v=Y5bbkxRyu4o) !

## ❤️ Support
Learned something new today? Reciprocate the love. ⭐ this repo for good karma.

## 💬 Connect With Me    
Want to discuss about GSoC / Rocket.Chat / Open-source ? Let's connect!
<div align="center">

| **Student** | Abhinav Kumar |
|:--------------------|:-------------------|
| **Organization** | [Rocket.Chat](https://rocket.chat/) |
| **Project** | [EmbeddedChat 2023](https://summerofcode.withgoogle.com/programs/2023/projects/sUXGt89N) |
| **GitHub** | [@abhinavkrin](https://github.com/abhinavkrin) |
| **LinkedIn** | [abhinavkrin](https://www.linkedin.com/in/abhinavkrin) |
| **Twitter** | [abhinavkr_in](https://www.twitter.com/abhinavkr_in) |
| **Website** | [avitechlab.com](https://avitechlab.com) |
| **Email** | <a href="mailto:abhinav@avitechlab.com">abhinav@avitechlab.com</a> |
| **Rocket.Chat** | [abhinav.kumar30](https://open.rocket.chat/direct/abhinav.kumar30) |
       
</div>