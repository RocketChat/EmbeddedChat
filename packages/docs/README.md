# EmbeddedChat Documentation

This is the official documentation website of EmbeddedChat.

> **Node.js Version Requirement**
>
> The `docs/` folder requires **Node.js v18 or higher** to run correctly.
> If you’re using a lower version (e.g., v16.19.0 from other parts of the monorepo), you may encounter errors.
>
> Use [NVM](https://github.com/nvm-sh/nvm) to install and switch to the correct version:
>
> ```bash
> nvm install 18
> nvm use 18
> ```

### Installation

```
 yarn install
```

### Local Development

```
 yarn dev
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
 yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.
