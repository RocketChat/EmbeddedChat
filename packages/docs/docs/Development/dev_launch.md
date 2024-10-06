---
title: Dev Launch
---
<!-- <h1 align='center'>Embedded Chat: A staple in excellent customer service</h1> -->

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)

## Development

### Local Setup

To develop and test `EmbeddedChat`, you need a local instance of the Rocket.Chat server. Follow the guide in the [Rocket.Chat Developer Docs](https://developer.rocket.chat/v1/docs/server-environment-setup) for setting up a Rocket.Chat development environment.

Ensure that the "Enable CORS" option is turned on in your Rocket.Chat server. You can find it under Administration > Settings > General > REST API > Enable CORS. This setting must be enabled to access the app's functionality.

#### Prerequisites

- **Node.js**: Version 16.19.0 is required. Use [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) for easy switching between Node.js versions.

  To install and use the correct Node.js version, execute the following commands with the specific version number:

  ```bash
  nvm install <version>
  nvm use <version>
  ```

  Replace `<version>` with the required Node.js version

- **Yarn Workspaces**: Ensure Yarn workspaces are enabled. If not, run:

  ```bash
  corepack enable
  ```

#### Install Dependencies

Install all necessary dependencies by navigating to the root directory of `EmbeddedChat` and running:

```bash
yarn
```

#### Build Packages

After installing dependencies, build the packages (`auth`, `api`, and `react`) by running the following command in the root directory:

```bash
yarn build
```

#### Starting Storybook for React

Navigate to the `react` package directory and start Storybook with the following commands:

```bash
cd packages/react
yarn storybook
```

Storybook should now be operational. Experiment with `EmbeddedChat` and its components, observing real-time changes in Storybook.

### Custom Rocket Chat Server Configuration

By default, Storybook connects to `http://localhost:3000`. To use a different Rocket Chat server:

Create a `.env` file in the `packages/react` directory.

Set the `STORYBOOK_RC_HOST` variable:

```bash
STORYBOOK_RC_HOST=<your-custom-url>
```

Alternatively, run this command in the `packages/react` directory:

```bash
STORYBOOK_RC_HOST=<your-custom-url> yarn storybook
```

### Package Development Overview

The project uses a monorepo structure with three key packages: `react`, `auth`, and `api`. Each package fulfills a vital role in the application:

#### React Package Development

The `react` package serves as the main frontend component, having all UI elements and views. It interfaces with the `auth` and `api` packages to manage interactions with the Rocket.Chat server, including API calls and authentication.

To develop and test changes in the `react` package:

1. Navigate to the directory of the `react` package:

```bash
cd packages/react
```

2. Start Storybook to view live changes:

```bash
yarn storybook
```

#### Auth Package Development

To develop and test changes in the `auth` package:

1. Navigate to the `auth` package directory:

   ```bash
   cd packages/auth
   ```

2. Start the development server:

   ```bash
   yarn dev
   ```

#### API Package Development

For development in the `api` package:

1. Navigate to the `api` package directory:

   ```bash
   cd packages/api
   ```

2. Start the development server:

   ```bash
   yarn dev
   ```

**Development Workflow Notes:**

- The `react` package relies on the `api` package. After making changes to the `api`, rebuild it using `yarn build` in `packages/api`, and then restart the React project.

- Similarly, the `api` package depends on the `auth` package. After making changes to `auth`, rebuild it using `yarn build` in `packages/auth`, and then restart the `api` development environment.

This structured approach facilitates cohesive development and integration across all components of the application.

### Conclusion

This environment offers a complete setup for developing and testing the `EmbeddedChat` component, alongside its `api` and `auth` packages. Feel free to explore and enhance the capabilities of `EmbeddedChat`!

### Contributors

<a href="https://github.com/RocketChat/EmbeddedChat/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=RocketChat/EmbeddedChat" />
</a>
