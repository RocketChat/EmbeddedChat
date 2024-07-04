# Embedded Chat: A Staple in Excellent Customer Service

An easy-to-use, full-stack component (React.js + backend behaviors) for embedding Rocket.Chat into your web app.

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)

## Technical Details on Theming

This guide dives into the technical aspects of how themes, styles, and configurations are implemented within the application.

## Understanding the Theming Approach

We use [Emotion](https://emotion.sh/) for styling. Each component has a `component.style.js` file for CSS definitions.

We use Emotion's theming with the `useTheme` hook and a custom `useCustomTheme` hook for specific adjustments:

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

This hook grants access to the theme, mode, colors, and invertedColors, streamlining their usage across different parts of the application. It ensures that colors are dynamically provided according to the current theme mode (light or dark), eliminating the need for repetitive code.

For example, in the CSS:

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

Here, `colors` from `useCustomTheme` sets `colors.border` and `colors.secondaryForeground`.

## Technical Overview of `useComponentOverrides`

Components utilize the `useComponentOverrides` hook to facilitate various types of customizations:

### Example: styleOverrides and classNames

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

In this example, it's evident that the className and style properties are dynamically applied based on the values received from styleOverrides for styles and classNames for classes.

### Example: Config Overrides

```jsx
const { styleOverrides, classNames, configOverrides } = useComponentOverrides(
  'MessageToolbox',
  className,
  style
);

// Extract toolOptions and threshold from configOverrides
const toolOptions =
  configOverrides.optionConfig?.toolOptions || optionConfig.toolOptions;
const threshold =
  configOverrides.optionConfig?.threshold || optionConfig.threshold;

// Process toolOptions based on the defined threshold
{
  toolOptions.slice(0, threshold).map((key) => toolMap[key]);
}

```

In this snippet, toolOptions and threshold are retrieved from configOverrides.optionConfig, or fallback to default values (optionConfig.toolOptions and optionConfig.threshold respectively) when not provided in configOverrides.

### Example: Variant Overrides

```jsx
const { styleOverrides, classNames, variantOverrides } =
  useComponentOverrides('MessageHeader');

// Determine the display name variant or default to 'Normal'
const displayNameVariant = variantOverrides || 'Normal';

// Render a span element for the message header username
<Box
  is="span"
  css={styles.userName}
  className={appendClassNames('ec-message-header-username', classNames)}
  style={
    displayNameVariant === 'Colorize'
      ? { color: getDisplayNameColor(message.u.username) }
      : null
  }
/>;
```

In this code snippet, variantOverrides provides customization options for the 'MessageHeader' component, influencing how the username is displayed based on the displayNameVariant.

## Applying Class Names for Easy Styling

Components like `MessageBody` are assigned specific class names (`ec-message-body`) for simplified CSS application.

## Conclusion

These insights enable straightforward customization of Embedded Chat's source code, ensuring adaptability to diverse project requirements.
