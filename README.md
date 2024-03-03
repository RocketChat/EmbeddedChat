<h1 align='center'>Embedded chat: A staple in excellent customer service</h1>

![image](https://github.com/coderboy-yash/EmbeddedChat/assets/109899959/b2961a35-4300-48df-b674-8a128c73e838)


An easy to use full-stack component (ReactJS + backend behaviors) embedding Rocket.Chat into your webapp.

_EmbeddedChat is a full-stack React component node module of the RocketChat application that is fully configurable, extensible, and flexible for use. It is tightly bound with the RocketChat server using Rocket.Chat nodejs SDK and its UI using RocketChat's Fuselage Design System._

![embeddedchatwall](https://user-images.githubusercontent.com/73601258/178119162-ecabb9b7-e3ae-4c70-8ab2-f6c02856f4c6.png)

<div align='center' width='100%'>
<a href="https://github.com/monoclehq">
<img src="https://open-source-assets.middlewarehq.com/svgs/RocketChat-EmbeddedChat-contributor-metrics-dark-widget.svg?caching=true"></img>
</a>
</div>

## Installation and Usage
Installation and usage documentation could be found here [EmbeddedChat installation and usage](packages/react/README.md)

## Development

### Local Setup

To develop and test `EmbeddedChat`, a local instance of Rocket.Chat server is necessary. For setting up a Rocket.Chat development environment, follow the guide provided at [Rocket.Chat GitHub Repository](https://github.com/RocketChat/Rocket.Chat#%EF%B8%8F-local-development).

#### Prerequisites

- **Node.js**: Version 16.19.0 is required. Use [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) for easy switching between Node.js versions.
  
  To install and use the correct Node.js version, execute:

  ```bash
  nvm install
  nvm use
  ```

- **Yarn Workspaces**: Ensure Yarn workspaces are enabled. If not, run:

  ```bash
  corepack enable
  ```

#### Install Dependencies

Install all necessary dependencies and build the packages (`auth`, `api`, and `react`) with:


```bash
yarn
```

### Starting Storybook for React

Navigate to the `react` package and start Storybook:

```bash
cd packages/react
yarn storybook
```

Storybook should now be operational. Experiment with `EmbeddedChat` and its components, observing real-time changes in Storybook.

#### Custom Rocket Chat Server Configuration

By default, Storybook connects to `http://localhost:3000`. To use a different Rocket Chat server:

- Create a `.env` file in the `packages/react` directory.
- Set the `STORYBOOK_RC_HOST` variable:

  ```bash
  STORYBOOK_RC_HOST=<your-custom-url>
  ```

  Alternatively, run this command in the `packages/react` directory:

  ```bash
  STORYBOOK_RC_HOST=<your-custom-url> yarn storybook
  ```

### Working with API and Auth Packages

#### Auth Package Development

To develop and test changes in the `auth` package:

1. Navigate to the `auth` package directory.
2. Start the playground server:

    ```bash
    cd packages/auth
    yarn dev
    ```

#### API Package Development

For development in the `api` package:

1. Navigate to the `api` package directory.
2. Start the playground server:

    ```bash
    cd packages/api
    yarn dev
    ```

Note: The `react` package depends on the `api` package. After making changes to `api`, rebuild it with `yarn build` in `package/api`, and then restart the `react` projects.

Similarly, the `api` package depends on the `auth` package. After changes to `auth`, rebuild it with `yarn build` in `package/auth`, and then restart the `api` development environment.

### Conclusion

This setup provides a comprehensive environment for developing and testing the `EmbeddedChat` component, along with its associated `api` and `auth` packages. Enjoy exploring and enhancing the capabilities of `EmbeddedChat`!

### Contributors

<a href="https://github.com/RocketChat/EmbeddedChat/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=RocketChat/EmbeddedChat" />
</a>
