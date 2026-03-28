import { EmbeddedChat } from '..';

export default {
  title: 'EmbeddedChat/Accessibility (WCAG 2.1)',
  component: EmbeddedChat,
  parameters: {
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
          { id: 'button-name', enabled: true },
          { id: 'aria-required-attr', enabled: true },
          { id: 'aria-roles', enabled: true },
          { id: 'keyboard', enabled: true },
        ],
      },
    },
    docs: {
      description: {
        component: `
WCAG 2.1 AA compliance demo for EmbeddedChat.

**What's covered:**
- All interactive elements have \`aria-label\` or associated \`<label>\`
- Formatting toolbar has \`role="toolbar"\` with arrow-key navigation
- Message actions toolbar has \`role="toolbar"\` with \`aria-label\`
- Reaction buttons have \`role="button"\`, \`aria-pressed\`, and \`aria-label\`
- Audio recorder timer has \`role="timer"\` and \`aria-live="polite"\`
- Login form inputs have \`htmlFor\`/\`id\` associations, \`aria-required\`, \`aria-invalid\`
- Login error messages use \`role="alert"\`
- Password toggle button has dynamic \`aria-label\`
- Chat header has \`role="banner"\`
        `,
      },
    },
  },
};

export const AccessibleChat = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
    channelName: 'general',
    anonymousMode: false,
    showRoles: true,
    showUsername: true,
    enableThreads: true,
    hideHeader: false,
    auth: { flow: 'PASSWORD' },
    dark: false,
  },
};

export const AccessibleChatDark = {
  args: {
    ...AccessibleChat.args,
    dark: true,
  },
};
