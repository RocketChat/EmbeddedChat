# Theming

Hello everyone,

After setting up the project, you can explore the project's components to understand how theming is implemented.

## Using Emotion for Styling

We use [Emotion](https://emotion.sh/) for styling our components. Theming is implemented by providing a theme object that includes a `components` field.

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
import { useComponentOverrides } from '../../theme/useComponentOverrides';

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
