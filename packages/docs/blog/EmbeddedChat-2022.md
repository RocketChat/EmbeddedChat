# GSoC-2022

<div align="center">
    <a href="https://summerofcode.withgoogle.com/projects/#6521788818784256"><img src="https://i.imgur.com/pgkUceb.png" width="650" alt="google-summer-of-code" /></a>
    <br />
    <b> 
        <p>
        Create a ready-to-go easy to embed mini-chat React component.
        </p>
    </b>
</div>

<p align="center">
    <code> 
        <a href="#-project-abstract">Project Abstract</a>&nbsp;&nbsp;&nbsp;
        <a href="#-deliverables">Deliverables</a>&nbsp;&nbsp;&nbsp;
        <a href="#-demo">Demo</a>&nbsp;&nbsp;&nbsp;
        <a href="#-contributions">Contributions</a>&nbsp;&nbsp;&nbsp;
        <a href="#-blog">Blog</a>&nbsp;&nbsp;&nbsp;
        <a href="#-mentor">Mentor</a>&nbsp;&nbsp;&nbsp;
        <a href="#-links">Links</a>
    </code>
</p>

I got a chance to work on a project called [EmbeddedChat](https://github.com/RocketChat/EmbeddedChat) which is an in-app chat solution to web applications needing a chat component to increase user engagement.

From just an idea (proposal) to a complete product - 3 months of Google Summer of Code passed.

I intend to maintain this repository as a final report summary of my GSoC work and a quick guide for all future GSoC aspirants.

## ⭐ Project Abstract

**EmbeddedChat allows users to integrate RocketChat into their React web-based applications easily also providing an amazing developer experience while introducing in-app chat solutions.**

## 🚢 Deliverables

The following are the deliverables of this project:

1.  Creation of UI using RocketChat Fuselage design system. [NEW]
2.  Providing real-time chat functionality using RocketChat node.js SDK. [NEW]
3.  Authentication using RocketChat’s Google SSO with an additional choice for `<username, password>` login (if the user already has an account). [NEW]
4.  Adding EmojiOne Emoji Picker to the component to ensure cross-platform functioning of emojis.[NEW]
5.  Using Rocket.Chat’s REST API to: [NEW]
-   Get channel details
-   Get the channel’s pinned messages
-   Get the channel’s starred messages
-   Get the channel attachments
-   Send a message to the channel
-   Get messages of the channel
6.  Providing the functionality to pin/star/react to any message and mention users. [NEW]

**All of the above deliverables were completed within the GSoC period. Yay! 🎉**

## 📺 Demo
### Sneak Peak
![randomgifec](https://user-images.githubusercontent.com/73601258/189498365-90bcc80a-4fb1-461b-a89e-99f1f8d31d95.gif)

### Providing real-time chat functionality using RocketChat node.js SDK

https://user-images.githubusercontent.com/73601258/189498385-1346c5af-ec75-42a9-b864-f6f3b1e49d88.mp4

https://user-images.githubusercontent.com/73601258/189498400-942f337a-0ee8-48e5-b539-70dc49d1e3e7.mp4

### Authentication using RocketChat’s Google SSO
https://user-images.githubusercontent.com/73601258/180390437-b28ceacb-7f3f-4b80-84c1-4e1709b6cd35.mp4

### Adding EmojiOne Emoji Picker to the component to ensure cross-platform functioning of emojis.
![image](https://user-images.githubusercontent.com/73601258/189498628-119c0417-a8cd-4775-acdf-41fdd3b7bc62.png)

### Using Rocket.Chat’s REST API
Took an object-oriented programming approach to build this. Created an API wrapper that is super simple to set up.
[Here](https://github.com/RocketChat/EmbeddedChat/blob/main/src/lib/api.js) is the code.

### Providing the functionality to pin/star/react to any message and mention users.

https://user-images.githubusercontent.com/73601258/189498498-602ddade-2883-43ac-91b7-9f63dc41cf84.mp4

https://user-images.githubusercontent.com/73601258/189498502-1310fb1c-293e-4bb4-a208-7b523dfdd23f.mp4

## 🚀 Contributions

### PRs

<div align="center">

| PR Link   | Description  |
| :-----------: | :------------------------------------:|
| [PR #1](https://github.com/RocketChat/EmbeddedChat/pull/1) | [NEW] initialize project and base setup |
| [PR #4](https://github.com/RocketChat/EmbeddedChat/pull/4) | NEW: issue and pr template |
| [PR #5](https://github.com/RocketChat/EmbeddedChat/pull/5) | IMPROVE: Responsiveness |
| [PR #7](https://github.com/RocketChat/EmbeddedChat/pull/7) | NEW: sending and receiving msgs (the oop way) |
| [PR #11](https://github.com/RocketChat/EmbeddedChat/pull/11) | Parsing emojis in message box |
| [PR #12](https://github.com/RocketChat/EmbeddedChat/pull/12) | NEW: AUTH (google SSO) |
| [PR #15](https://github.com/RocketChat/EmbeddedChat/pull/15) | NEW: Development documentation |
| [PR #26](https://github.com/RocketChat/EmbeddedChat/pull/26) | [IMPROVE] UI/UX improvements |
| [PR #40](https://github.com/RocketChat/EmbeddedChat/pull/40) | FIX: when host is https set useSSL as true |
| [PR #41](https://github.com/RocketChat/EmbeddedChat/pull/41) | [IMPROVE] more options to be present whether or not its fullscreen |
| [PR #46](https://github.com/RocketChat/EmbeddedChat/pull/46) | FIX: when cookies are there assume user present |
| [PR #47](https://github.com/RocketChat/EmbeddedChat/pull/47) | CHORE: remove tech.co.html |
| [PR #48](https://github.com/RocketChat/EmbeddedChat/pull/48) | Handling attachments |
| [PR #44](https://github.com/RocketChat/EmbeddedChat/pull/44) | NEW: react to message |
| [PR #42](https://github.com/RocketChat/EmbeddedChat/pull/42) | NEW: Pin and star messages
| [PR #39](https://github.com/RocketChat/EmbeddedChat/pull/39) | Add format to all files
| [PR #29](https://github.com/RocketChat/EmbeddedChat/pull/29) | NEW: CI/CD Pipeline to deploy the package

</div>
    
### My overall contributions at Rocket.Chat
    
Besides my GSoC project I have been contributing prolifically to other Rocket.Chat projects - [RocketChat.js.SDK](https://github.com/RocketChat/Rocket.Chat.js.SDK), [RC4Community](https://github.com/RocketChat/RC4Community), [fuselage](https://github.com/RocketChat/fuselage), [Rocket.Chat](https://github.com/RocketChat/Rocket.Chat).
    
## 😎 Blog
    
I have been writing blogs regarding my progress in GSoC. 
 - [My journey with open source and lessons learned](https://dev.to/sidmohanty11/my-journey-with-open-source-and-lessons-learned-30e7)
 - [[PART-I] GSoC 2022 | Rocket.Chat | EmbeddedChat](https://dev.to/sidmohanty11/part-i-gsoc-2022-rocketchat-embeddedchat-3njh)
 - [[PART-II] GSoC 2022 | Rocket.Chat | EmbeddedChat](https://dev.to/sidmohanty11/part-ii-gsoc-2022-rocketchat-embeddedchat-15g3)
 - [Final Part: GSoC 2022 | Rocket.Chat | EmbeddedChat](https://dev.to/sidmohanty11/final-part-gsoc-2022-rocketchat-embeddedchat-37g8)

## 🎓 Mentor

A big big thank you to my mentor for the guidance before and throughout GSoC. 🙏 

I learned beyond GSoC from him and am forever grateful to be mentored by him.

- **Rohan Lekhwani** - [GitHub](https://github.com/RonLek). [LinkedIn](https://www.linkedin.com/in/rohanlekhwani)

## 🔗 Links

- Read my EmbeddedChat project proposal that got me accepted to GSoC [here](https://docs.google.com/document/d/1YeAz-hzv-7NY5HApraz0lOCNj2_Vc-ys_w2qp3qd-nQ/edit?usp=sharing).

- I also complemented it with Figma designs. Check them out [here](https://www.figma.com/file/hj0BqzAvB15zBv7A8fMYc9/RocketChat-ReactJS-Component?node-id=0%3A1).

- My GSoC Presentation can be found [here](https://docs.google.com/presentation/d/1hNO-iGlA0nnyHS5o6XlgwGaYP7IgOtcHdg--HCFNABY/edit?usp=sharing).

- Watch the above presentation in video - [here](https://www.youtube.com/watch?v=gcB5c6cvg9w&t=6s) !

## ❤️ Support
Learned something new today? Reciprocate the love. ⭐ this repo for good karma.
    
## 💬 Connect With Me    
Want to discuss about GSoC / Rocket.Chat / Open-source ? Let's connect!
<div align="center">

| **Student** | Sidharth Mohanty |
|:--------------------|:-------------------|
| **Organization** | [Rocket.Chat](https://rocket.chat/) |
| **Project** | [EmbeddedChat](https://docs.rocket.chat/contributors/annual-contribution-programs/google-summer-of-code/google-summer-of-code-2022#rocket.chat-reactjs-fullstack-component) |
| **GitHub** | [@sidmohanty11](https://github.com/sidmohanty11) |
| **LinkedIn** | [sidmohanty11](https://www.linkedin.com/in/sidmohanty11) |
| **Twitter** | [sidmohanty11](https://www.twitter.com/sidmohanty11) |
| **Blogs** | [sidmohanty11](https://dev.to/sidmohanty11) |
| **Website** | [sidmohanty11.github.io](https://sidmohanty11.github.io) |
| **Email** | <a href="mailto:sidmohanty11@gmail.com">sidmohanty11@gmail.com</a> |
| **Rocket.Chat** | [sidharth.mohanty](https://open.rocket.chat/direct/sidharth.mohanty) |
       
</div>