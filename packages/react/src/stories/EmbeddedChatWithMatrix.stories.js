import { EmbeddedChat } from '..';

export default {
  title: 'EmbeddedChat/WithMatrix',
  component: EmbeddedChat,
};

export const WithMatrix = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
    channelName: 'general',
    anonymousMode: false,
    toastBarPosition: 'bottom right',
    showRoles: true,
    enableThreads: true,
    hideHeader: false,
    auth: {
      flow: 'PASSWORD',
    },
    theme: 'matrix',
    layoutMode: 'timeline',
    dark: true,
  },
};
