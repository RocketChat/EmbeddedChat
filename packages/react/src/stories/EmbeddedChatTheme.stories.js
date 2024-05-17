import { EmbeddedChat } from '..';
import TestTheme from '../theme/TestTheme';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'EmbeddedChat/Themes',
  component: EmbeddedChat,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Test_Theme = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: 'GENERAL',
    GOOGLE_CLIENT_ID: '',
    moreOpts: true,
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: true,
    showAvatar: false,
    enableThreads: true,
    theme: TestTheme,
  },
};
