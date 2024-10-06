import { EmbeddedChat } from '../..';
import StormySeas from '../../theme/ModernVariant/StormySeas';
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'EmbeddedChat/Design Variants/ModernVariant/Simplistic',
  component: EmbeddedChat,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Stormy_Seas = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: false,
    showUsername: true,
    showName: false,
    showAvatar: true,
    enableThreads: true,
    hideHeader: false,
    theme: StormySeas,
    auth: {
      flow: 'PASSWORD',
    },
    dark: true,
  },
};
