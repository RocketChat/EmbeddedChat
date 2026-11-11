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

### AI Theme Generator integration

The Layout Editor can generate a complete, accessible EmbeddedChat theme from a developer's description. It talks directly to Ollama running on the developer's machine—no API key or separate proxy service is required.

Install Ollama, start a local model, then open the AI Theme Generator:

```bash
ollama run gemma4
```

The default URL is `http://localhost:11434` and the default model is `gemma4`; both can be changed directly in the panel or configured at build time:

```bash
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=gemma4
```

The adapter selector also supports OpenAI and Google Gemini. These providers
use the shared `@embeddedchat/ai-adapter` package; enter a development API key,
model, and optional compatible base URL in the panel. Keys are kept in memory
only and are never stored by the Layout Editor.

If the editor is served from `http://localhost:5173` and the browser reports a
CORS error, start Ollama once with that origin allowed:

```bash
OLLAMA_ORIGINS=http://localhost:5173 ollama serve
```

Use the actual Layout Editor origin if it differs. Ollama permits local API
access without authentication, and can be configured to allow additional web
origins when needed.

Ollama is asked for a narrow JSON schema:

```json
{
  "primaryHex": "#f59e0b",
  "accentHex": "#8b5cf6",
  "radius": "0.5rem",
  "fontFamily": "Arial, Helvetica, sans-serif",
  "mode": "dark"
}
```

The generator only allows local Ollama URLs (`localhost`, `127.0.0.1`, or `::1`). Follow-up prompts include prior instructions, but patch only the explicitly requested tokens—refining corner radius or typography cannot regenerate the palette. Select **Deterministic fallback** in the adapter selector to use the offline parser instead. The browser validates the response, checks text contrast, and presents a draft before applying or exporting the final JSON.

### AI Component Generator integration

The AI Component Generator creates validated Rocket.Chat UI-Kit blocks. It exports a versioned JSON configuration for the public `generatedUi` prop in `@embeddedchat/react`; it does not publish to, or modify, an npm installation.

Generate a component, choose its display surface and **Open from** placement, then open **Export** and select **Download JSON** or **Copy Config**. Store the resulting JSON in the host application's repository, CMS, or backend. The host application fetches or loads that JSON and passes it to `EmbeddedChat`, along with an `onGeneratedUiAction` callback for buttons and form values.

The optional **Dev mode** sync action is only a local contributor aid. It writes a Storybook fixture through the Layout Editor's Vite development server so contributors can exercise the same public package contract without manually pasting generated JSON. It is excluded from production builds and is not part of the npm integration path.

**Apply to editor** updates the Layout Editor's own chat preview; it is not deployment. The editor and EmbeddedChat use the same renderer and validation contract. Copy Config contains the entire configuration, not just `blocks`: store it as a `.json` file in your application. If manually replacing the local JavaScript fixture, keep its `export const generatedUiPreview = ...;` wrapper around that object.

For local contributor testing:

1. Build the workspaces with `yarn build` from the repository root.
2. Start the editor with `yarn workspace layout_editor dev` and React Storybook with `yarn workspace @embeddedchat/react storybook` in separate terminals.
3. Open the editor using `localhost` or `127.0.0.1`, generate a component, choose its surface and placement, and enable **Dev mode**.
4. Select **Sync to EmbeddedChat preview**. This replaces only `packages/layout_editor/src/fixtures/generatedUiPreview.js`; Storybook's **EmbeddedChat/WithGenUi** story imports that fixture and reloads it. Use your usual Rocket.Chat host/room/auth Storybook controls to test in a connected chat.
5. Open the generated icon in the chosen toolbar. Form edits and actions are local preview behavior unless your host supplies an action callback; sync does not post anything to Rocket.Chat.

Sync accepts only same-origin JSON POSTs on the local development server, validates the payload, caps requests at 256 KiB, and serializes atomic fixture writes. It is unavailable on deployed/static editors and non-loopback hosts. Hosted consumers should follow the [Generated UI integration guide](../react/README.md#generated-ui) instead.

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
