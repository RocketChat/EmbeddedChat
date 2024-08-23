---
title: Theming Guide
---

# Theming

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)

EmbeddedChat supports various styling, customization options, and different variants. This guide will explore these aspects in depth.

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
  radius: '0.2rem',
  commonColors: {
    black: 'hsl(0, 100%, 0%)',
    white: 'hsl(0, 100%, 100%)',
  },
  schemes: {
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
};
```

### Understanding the Theme Object

- The `radius` key defines the border-radius applied throughout the app.

- The `commonColors` key provides a set of commonly used colors in the app.

- The `schemes` key contains `light` and `dark` subkeys which controls various aspects such as foreground color, background color, border color, input color, and colors for warning and success toast messages in specific light or dark modes.

- The `variants` and `components` keys will be detailed further in the guide.

- The `typography` key contains a `default` sub-key which includes the font family, font size, and weights for the entire app. Specific font sizes and weights for headings are then defined below that, and changing these will update the heading fonts accordingly.

- The `shadows` key currently includes two shadows used in the app. You can give different colors or styles to these shadows as needed. If more shadows are added, the source code will also need to be modified to reflect those changes.

### Understanding to the `components` key

The `components` key/object allows you to customize specific components by applying custom styles, adding custom classes, or modifying certain configurations.

To use this object, you need to specify the "ComponentName" as a key, which can include three sub-keys:

- `styleOverrides`
- `classNames`
- `configOverrides`

However, `configOverrides` is currently only applicable to three components: 'ChatHeader', 'ChatInputFormattingToolbar', and 'MessageToolbox'.

Let's first understand `styleOverrides` and `classNames`:

```jsx
components: {
  ChatInput: {
    styleOverrides: {
      fontWeight: 400,
      color: "gray",
      border: "1px solid black"
    },
    classNames: "myCustomClassForChatInput"
  },
}
```

In this example:

- `theme.components.ChatInput.styleOverrides` will apply the specified styles to the ChatInput component.
- `theme.components.ChatInput.classNames` will apply the specified class name to the ChatInput component.

The `configOverrides` object contains `optionConfig`, which includes two keys: `surfaceItems` and `menuItems`. `surfaceItems` specifies which options should be displayed directly on the surface container. Options listed in `menuItems` will be wrapped inside a menu component.

```jsx
ChatHeader: {
  configOverrides: {
    optionConfig: {
      surfaceItems: [
        'minmax',
        'close',
        'thread',
        'mentions',
        'starred',
        'pinned',
        'files',
      ],
      menuItems: [
        'members',
        'search',
        'rInfo',
        'logout',
      ],
    },
  },
}
```

In this example, for `ChatHeader`, options from `minmax` to `files` will be displayed directly on the surface, while options from `members` to `logout` will be wrapped inside a menu, as shown:

![image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/84b9558b-5496-4904-8788-070b519aa1f2)

If an option is omitted, it will simply not be rendered. This flexibility is useful for customizing the application to your needs.

Similarly, for `MessageToolbox`, the supported options are:

```jsx
[
  'reaction',
  'reply',
  'quote',
  'star',
  'pin',
  'edit',
  'delete',
  'report',
],
```

For the `ChatInputFormattingToolbar` component, the supported options in `surfaceItems` are:

```jsx
["emoji", "formatter", "audio", "video", "file"];
```

Additionally, all formatters can be reordered or removed by passing a `formatter` array in the `optionConfig`, as demonstrated below:

```jsx
formatters: ["bold", "italic", "strike", "code", "multiline"];
```

Note: In `ChatInputFormattingToolbar`, `menuItems` is not supported as all options will be displayed directly on the surface, and none will be inside a menu.

## Understanding the `variants` key

EmbeddedChat supports different variants for its components. For example, the `Message` component currently supports two variants:

1. **Flat Chat Pattern**: All messages are displayed on the same side in a flat layout.
2. **Bubble Design**: Messages are displayed as bubbles, with your messages on one side and others on the opposite side for easy separation.

Similarly, the `MessageHeader` component supports two configurations:

1. **Default**: The font color is the foreground color.
2. **Randomly Colorized**: The username or name is given a random color based on the username.

Additionally, many components support two types of views: `Sidebar` and `Popup`. By default, these components are displayed in sidebars, but they can be customized to appear as popups.

### Example: Enabling Bubble Variant for Messages

To enable the bubble variant for the `Message` component, use the following configuration:

```jsx
variants: {
  Message: 'bubble',
}
```

**Flat Chat Pattern**:

![Flat Design](https://github.com/RocketChat/EmbeddedChat/assets/78961432/2877b662-3591-463c-b9a5-deacd636b1db)

**Bubble Design**:

![Bubble Design](https://github.com/RocketChat/EmbeddedChat/assets/78961432/c3c18d91-e51f-4abc-a3f6-1ae5a0d9773e)

### Example: Enabling Colorize Variant for MessageHeader

To enable the colorize variant for the `MessageHeader` component, use the following configuration:

```jsx
variants: {
  MessageHeader: 'colorize',
}
```

**Default Configuration**:

![Default Configuration](https://github.com/RocketChat/EmbeddedChat/assets/78961432/190e125a-b312-4bdf-8560-5c5b04b2ebfa)

**Randomly Colorized**:

![Randomly Colorized](https://github.com/RocketChat/EmbeddedChat/assets/78961432/e7652162-dc83-4b60-9afb-045c5cecde28)

### Example: Customizing View Type for Components

To display components as popups instead of sidebars, use the following configuration:

```jsx
variants: {
  PinnedMessages: { viewType: 'Popup' },
  ThreadedMessages: { viewType: 'Popup' },
  MentionedMessages: { viewType: 'Popup' },
  StarredMessages: { viewType: 'Popup' },
  FileGallery: { viewType: 'Popup' },
}
```

These components can now appear as popups instead of being displayed in the sidebar. Each component originally shown in the sidebar can be configured individually to appear as a popup. Apart from the aforementioned, the following components can currently be displayed either in the sidebar or as popups: "RoomInformation," "RoomMembers," and "UserInformation."

**Sidebar View**:

![Sidebar View](https://github.com/RocketChat/EmbeddedChat/assets/78961432/7acdf6d1-075b-4027-91a9-38736fe9cc58)

**Popup View**:

![Popup View](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b7efade3-b041-4311-a8a7-3e642b6f0de1)

## Conclusion

Feel free to explore and customize these components according to your project's needs. If you have any questions or need further assistance, please don't hesitate to ask.

For those interested in delving into the technical implementation details, please [click here](../Development/theming_technical.md).

Happy theming!
