---
title: Quick Control Guide
---

# Quick Control Guide

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)

EmbeddedChat provides 'Quick Control' to simplify remote configuration of its settings, including themes, via the RC app, which can be installed in your Rocket.Chat workspace. It also aids in implementing secure login by storing the resume token as an HTTP-only cookie and integrating Rocket.Chat's OAuth login capabilities.

### Installation

To install this application, follow these steps:

1. Clone the repository to your local machine:

   ```
   git clone https://github.com/RocketChat/EmbeddedChat.git
   ```

2. Navigate to the `packages/rc-app` directory.

3. Open a command prompt and execute the following command:

   ```
   rc-apps deploy --url host_url --username your_username --password your_password
   ```

Ensure to substitute `host_url`, `your_username`, and `your_password` with your Rocket.Chat server's URL, username, and password respectively.

Note: A Rocket.Chat server setup is required. If you haven't set up one yet, refer to this [link](https://developer.rocket.chat/open-source-projects/server/server-environment-setup) for instructions.

### Usage

Once the Quick Control RC app is installed, navigate to App Settings, select EmbeddedChat, and you can configure EmbeddedChat properties remotely and access the other mentioned features.
