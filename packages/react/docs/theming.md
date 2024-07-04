# Embedded Chat: A Staple in Excellent Customer Service

An easy-to-use, full-stack component (React.js + backend behaviors) for embedding Rocket.Chat into your web app.

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)

## Theming Guide

EmbeddedChat supports various styling, customization options, and different variants. This guide will explore these aspects in depth along with some technical details on their implementation. If you prefer to skip the technical details and directly learn how to theme EmbeddedChat, [click here](#how-to-theme-embeddedchat).

### Theming Structure Explained

We use [Emotion](https://emotion.sh/) for styling our components. For every component or view where styling is required, you can find a `component.style.js` file where the necessary CSS is written.

We use Emotion theming with the `useTheme` hook, and we created a custom `useCustomTheme` hook to adjust according to specific needs and make the code more intuitive. The `useCustomTheme` hook is internal, but here's how it works:

```jsx
import { useTheme } from '@emotion/react';
import { useRCContext } from '../context/RCInstance';

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

export const useCustomTheme = () => {
  const { ECOptions } = useRCContext() || {};
  const theme = useTheme();

  const mode = ECOptions?.mode || 'light';

  const colors = theme.schemes?.[mode];
  const invertedColors = theme.schemes?.[invertMode(mode)];

  return { theme, mode, colors, invertedColors };
};
```

This hook retrieves the mode (light or dark) from the EmbeddedChat RC Context passed from the main component and provides access to the variables `mode`, `colors`, and `invertedColors`, which are then used while writing CSS for the components.

Most of the border colors, shadows, background colors, text colors, border radius, and other properties are taken from the theme object. By providing different values in the theme object, you can change the look of EmbeddedChat.

Here is an example:

```jsx
const { colors } = useCustomTheme();
const main = css`
  margin: 0.2rem 2rem;
  display: block;
  max-height: 10rem;
  overflow: scroll;
  overflow-x: hidden;
  max-height: 145px;
  border: 1px solid ${colors.border};
  border-radius: 0.2rem;
  color: ${colors.secondaryForeground};
`;
```

As you can see, `colors` is extracted from `useCustomTheme`, and then `colors.border` and `colors.secondaryForeground` are used to style a component.

These details provide an in-depth understanding of how theming works in this application. However, you can simply pass a theme object in the given structure with the required values according to your choice, and the styles will adjust accordingly.

### How to Theme EmbeddedChat

To start theming EmbeddedChat, you need to provide a theme object to the EmbeddedChat component, as shown below:

```jsx
<EmbeddedChat
  // ...other props
  theme={myCustomTheme}
/>
```

where `myCustomTheme` must adhere to a specific format. The default theme object is shown for demonstration:

```jsx
const DefaultTheme = {
  schemes: {
    radius: '0.2rem',
    common: {
      black: 'hsl(0, 100%, 0%)',
      white: 'hsl(0, 100%, 100%)',
    },
    light: {
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(240, 10%, 3.9%)',
      card: 'hsl(0, 0%, 100%)',
      cardForeground: 'hsl(240, 10%, 3.9%)',
      popover: 'hsl(0, 0%, 100%)',
      popoverForeground: 'hsl(240, 10%, 3.9%)',
      primary: 'hsl(240, 5.9%, 10%)',
      primaryForeground: 'hsl(0, 0%, 98%)',
      secondary: 'hsl(240, 4.8%, 95.9%)',
      secondaryForeground: 'hsl(240, 5.9%, 10%)',
      muted: 'hsl(240, 4.8%, 95.9%)',
      mutedForeground: 'hsl(240, 3.8%, 46.1%)',
      accent: 'hsl(240, 4.8%, 95.9%)',
      accentForeground: 'hsl(240, 5.9%, 10%)',
      destructive: 'hsl(0, 84.2%, 60.2%)',
      destructiveForeground: 'hsl(0, 0%, 98%)',
      border: 'hsl(240, 5.9%, 90%)',
      input: 'hsl(240, 5.9%, 90%)',
      ring: 'hsl(240, 5.9%, 10%)',
      warning: 'hsl(38, 92%, 50%)',
      warningForeground: 'hsl(48, 96%, 89%)',
      success: 'hsl(91, 60.4%, 81.2%)',
      successForeground: 'hsl(90, 61.1%, 14.1%)',
      info: 'hsl(214, 76.4%, 50.2%)',
      infoForeground: 'hsl(214.3, 77.8%, 92.9%)',
    },
    dark: {
      background: 'hsl(240, 10%, 3.9%)',
      foreground: 'hsl(0, 0%, 98%)',
      card: 'hsl(240, 10%, 3.9%)',
      cardForeground: 'hsl(0, 0%, 98%)',
      popover: 'hsl(240, 10%, 3.9%)',
      popoverForeground: 'hsl(0, 0%, 98%)',
      primary: 'hsl(0, 0%, 98%)',
      primaryForeground: 'hsl(240, 5.9%, 10%)',
      secondary: 'hsl(240, 3.7%, 15.9%)',
      secondaryForeground: 'hsl(0, 0%, 98%)',
      muted: 'hsl(240, 3.7%, 15.9%)',
      mutedForeground: 'hsl(240, 5%, 64.9%)',
      accent: 'hsl(240, 3.7%, 15.9%)',
      accentForeground: 'hsl(0, 0%, 98%)',
      destructive: 'hsl(0, 62.8%, 30.6%)',
      destructiveForeground: 'hsl(0, 0%, 98%)',
      border: 'hsl(240, 3.7%, 15.9%)',
      input: 'hsl(240, 3.7%, 15.9%)',
      ring: 'hsl(240, 4.9%, 83.9%)',
      warning: 'hsl(48, 96%, 89%)',
      warningForeground: 'hsl(38, 92%, 50%)',
      success: 'hsl(90, 61.1%, 14.1%)',
      successForeground: 'hsl(90, 60%, 90.2%)',
      info: 'hsl(214.3, 77.8%, 92.9%)',
      infoForeground: 'hsl(214.4, 75.8%, 19.4%)',
    },
  },

  breakpoints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },

  variants: {},

  components: {},

  typography: {
    default: {
      fontFamily: "'Times New Roman', serif",
      fontSize: 16,
      fontWeightRegular: 400,
    },
    h1: {
      fontSize: '2rem',
      fontWeight: 800,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 800,
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 400,
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    h5: {
      fontSize: '0.83rem',
      fontWeight: 400,
    },
    h6: {
      fontSize: '0.67rem',
      fontWeight: 500,
    },
  },
  shadows: [
    'none',
    'rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px',
    'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
  ],
  zIndex: {
    divider: 1000,
    body: 1100,
    general: 1200,
    menu: 1300,

    tooltip: 1400,
    modal: 1500,
    toastbar: 1600,
  },
};
```

### Understanding the Theme Object

- The `schemes` object contains `radius` (which is used to give border-radius in the application, increasing this will make EmbeddedChat look more curvy). The `light` and `dark` objects inside control the colors of various elements such as foreground color, background color, border color, input color, colors for warning and success toast messages etc.

- The `breakpoints` are currently not in use but are planned to be included to make the app more mobile responsive in the future.

- The `variants` and `components` objects will be detailed further in the guide.

- The `typography` object contains a `default` object which includes the font family, font size, and weights for the entire application. Specific font sizes and weights for headings are then defined below that, and changing these will update the heading fonts accordingly.

- The `shadows` object currently includes two shadows used in the app. You can give different colors or styles to these shadows as needed. If more shadows are added, the source code will also need to be modified to reflect those changes.

- The `zIndex` object controls the stacking of different components in the application. It is recommended not to change these values unless necessary. If a requirement arises, adjustments can be made accordingly.

For example:

```json
"components": {
  "ChatInput": {
    "styleOverrides": {
      "fontWeight": 400,
      "color": "gray",
      "border": "1px solid black"
    },
    "classNames": "myCustomClassForChatInput"
  },
  "Message": {
    "classNames": "myCustomClass"
  }
}
```

In the above example:

- theme.components.ChatInput.styleOverrides would be applied to the style of the ChatInput component.
- theme.components.ChatInput.classNames would be applied to the className of the ChatInput component.

## Using the useComponentsOverrides Hook

We provide a `useComponentsOverrides` hook that returns the necessary data for component customization.

```jsx
import { useComponentOverrides } from '../../hooks/useComponentOverrides';

export const MessageBody = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageBody',
    className,
    style
  );

  return (
    <Box
      css={MessageBodyCss}
      className={appendClassNames('ec-message-body', classNames)}
      style={styleOverrides}
      {...props}
    >
      <p>{children}</p>
    </Box>
  );
};
```

## Adding Classes to Components

We also add a class to each component. For example, `ec-message-body` for the MessageBody component.

Feel free to explore and customize these components according to your project's needs.

If you have any questions or need further assistance, please don't hesitate to ask.

Happy theming!
