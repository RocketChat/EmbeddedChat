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
        ],
      },
    },
  },
};

/**
 * Full WCAG 2.1 AA accessible EmbeddedChat.
 *
 * What's covered in this build:
 *   - Skip-to-content link (visible on Tab key press)
 *   - Chat textarea: aria-label, aria-multiline, aria-disabled
 *   - Send button: aria-label="Send message"
 *   - Formatting toolbar: role="toolbar", arrow-key navigation (useKeyboardNav)
 *   - All toolbar buttons: aria-label (emoji, file, link, formatters, more)
 *   - More button: aria-expanded, aria-haspopup
 *   - Message toolbox: role="toolbar", arrow-key navigation
 *   - AudioMessageRecorder: aria-label on record/stop/cancel, role="timer" + aria-live
 *   - VideoMessageRecorder: aria-label on all controls, role="timer" + aria-live
 *   - MessageReactions: role="button", aria-pressed, aria-label, keyboard Enter/Space
 *   - EmojiPicker: role="dialog", aria-modal, aria-label
 *   - ChatHeader: role="banner", aria-label
 *   - LoginForm: htmlFor/id label pairing, aria-required, aria-invalid, aria-describedby
 *   - Login error messages: role="alert"
 *   - Password toggle: dynamic aria-label (Show/Hide password)
 *
 * Test keyboard navigation:
 *   Tab          — move between interactive elements
 *   Arrow keys   — navigate within toolbars
 *   Enter/Space  — activate buttons and reactions
 *   Escape       — close menus
 */
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
    channelName: 'general (dark)',
  },
};

export const AccessibleChatAnonymous = {
  args: {
    ...AccessibleChat.args,
    anonymousMode: true,
    channelName: 'general (anonymous)',
  },
};
