---
title: UI-Elements
---

# UI-Elements

![Embedded Chat Demo](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)

This component is part of a monorepo, specifically within the `packages/ui-elements` project, which houses the main EmbeddedChat Component.

![image](https://github.com/user-attachments/assets/2fd76929-ce43-4bb3-8ea8-3a7318468923)

### Try It Out 🚀

Check out our Storybook showcasing all the components in action! Preview and test them here: https://rocketchat.github.io/EmbeddedChat/ui-elements/

### Development

To develop and view the components:

1. Clone the repository.
2. Navigate to `packages/ui-elements`.
3. Run the following commands:

   ```bash
   yarn build       # To build the component library
   yarn storybook   # To view the components in real-time
   ```

### Installation

To install the component library, run:

```bash
yarn add @embeddedchat/ui-elements
```

This library offers a range of UI components, including `Box`, `Input`, `StaticSelect`, `MultiSelect`, and more. For a complete list of available components, please refer to the Storybook.

You can import components using the following syntax:

````jsx
import {
  Box,
  Heading,
  Icon,
  Menu,
  useToastBarDispatch,
  useComponentOverrides,
} from '@embeddedchat/ui-elements';

### Theming

By default, the component uses a standard theme. You can apply a custom theme and mode by importing `ThemeProvider` from `@embeddedchat/ui-elements` and using it as follows:

```jsx
import { ThemeProvider } from "@embeddedchat/ui-elements";

<ThemeProvider theme={customTheme} mode="light">
  <YourMainComponent />
</ThemeProvider>;
````

Supported modes are `'light'` and `'dark'`. Ensure that the `theme` prop is provided with the correct format.

The library also includes a `useTheme` hook for managing the theme and mode:

```jsx
import { useTheme } from "@embeddedchat/ui-elements";

const { theme, mode, setTheme, setMode } = useTheme();
```

The `useTheme` hook provides:

- `theme`: The current theme object.
- `mode`: The current mode (`'light'` or `'dark'`).
- `setTheme`: A function to update the theme dynamically.
- `setMode`: A function to toggle between `'light'` and `'dark'` modes.

`setTheme` allows you to change the theme on-the-fly, while `setMode` lets you switch between light and dark modes. This flexibility is useful for dynamically adjusting the appearance of your application based on user preferences or other conditions.

You can use this hook to style your components with the provided theme. `theme` object also dynamically provides `colors` and `invertedColors`, simplifying color management. `theme.colors` will automatically adjust according to the mode, while `invertedColors` provides colors for the alternate mode.

Additionally, the library offers `darken` and `lighten` functions to dynamically adjust color brightness:

```jsx
import { darken, lighten } from "@embeddedchat/ui-elements";
```

These functions can be used as follows:

```jsx
background-color: ${mode === 'light'
      ? darken(colors.background, 0.03)
      : lighten(colors.background, 1)};
```

This hook allows you to dynamically switch modes or themes as needed. The `theme` object must adhere to a specific format, as outlined in the EmbeddedChat `react` project [Readme.md](../Usage/theming.md).
