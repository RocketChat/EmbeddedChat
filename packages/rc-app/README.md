# Embedded Chat: A staple in excellent customer service

An easy-to-use, full-stack component (React.js + backend behaviors) for embedding Rocket.Chat into your web app.

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)

## EmbeddedChat RC App

This monorepo hosts an RC app designed to enhance EmbeddedChat functionalities. It facilitates remote configuration of EmbeddedChat settings, implements secure login (storing the resume token as an HTTP-only cookie), and help integrates Rocket.Chat OAuth login capabilities.

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