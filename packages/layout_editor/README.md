# Embedded Chat: A Staple in Excellent Customer Service

An easy-to-use, full-stack component (React.js + backend behaviors) for embedding Rocket.Chat into your web app.

![ec-demo-image](https://github.com/RocketChat/EmbeddedChat/assets/78961432/b85c7b8a-65e2-4a90-a843-f4072c942ac0)

## Layout Editor

![image](https://github.com/user-attachments/assets/a42a66af-d8c0-4d3a-aa1a-71f91b07310e)

We offer a layout editor that lets you customize the design and appearance of the EmbeddedChat component in real time. Features include:

- **ChatHeader Options**: Add, remove, or reorder various options.
- **MessageToolbox Options**: Tailor toolbox settings.
- **ChatInputFormatting Toolbar Options**: Adjust input toolbar settings.
- **Drag-and-Drop**: Easily switch and reorder menu and surface items.
- **Resizable Sidebar**: Adjust the sidebar by dragging.
- **Theme Lab**: Customize layout and theme settings, including palette colors and typography.

### Try It Out 🚀

Explore the Layout Editor to style and customize EmbeddedChat to your needs. Generate a theme object and pass it to EmbeddedChat via props. Start customizing here: [Layout Editor](https://rocketchat.github.io/EmbeddedChat/layout_editor/)

### Theme Lab

In the Theme Lab, you can:

- **Customize Palette Colors**: Adjust colors for both light and dark modes.
- **Font Settings**: Modify font-related settings.
- **Layout Customization**: Change layout variants and display names, and restore deleted options.

Once satisfied with your changes, click the "Generate Theme" button to create a theme object.

![image](https://github.com/user-attachments/assets/88ab51b6-aac6-41cc-b911-38378ed61e12)

### Integration

To apply your custom theme:

```jsx
<EmbeddedChat
  // ...other props
  theme={myCustomTheme}
/>
```

Alternatively, you can paste the theme object into the Theme settings of the EmbeddedChat RC App. Note: These settings will only take effect if the `remoteOpt` prop is set to `true` when configuring EmbeddedChat.

### Development

Clone the repo, navigate to `packages/layout_editor`, then run:

```bash
yarn dev   # Start server
yarn build # Build for production
yarn preview # Preview build
```

### Additional Resources

- For installation instructions of the EmbeddedChat RC App, visit [this guide](https://rocketchat.github.io/EmbeddedChat/docs/docs/Usage/ec_rc_setup).
- For detailed prop usage, refer to [this guide](https://rocketchat.github.io/EmbeddedChat/docs/docs/Usage/embeddedchat_setup).
