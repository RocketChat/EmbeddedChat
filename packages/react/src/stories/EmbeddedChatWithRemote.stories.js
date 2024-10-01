import { EmbeddedChat } from '..';

export default {
  title: 'EmbeddedChat/WithRemoteOpt',
  component: EmbeddedChat,
  parameters: {
    controls: { disable: true },
  },
};

export const With_Remote_Opt = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: true,
    enableThreads: true,
    hideHeader: false,
    remoteOpt: true,
    auth: {
      flow: 'PASSWORD',
    },
    dark: false,
  },
};
