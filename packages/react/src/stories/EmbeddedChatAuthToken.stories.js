import { EmbeddedChat } from '..';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'EmbeddedChat/WithAuthToken',
  component: EmbeddedChat,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const WithAuthToken = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: true,
    showAvatar: false,
    enableThreads: true,
    auth: {
      flow: 'TOKEN',
      credentials: {
        resume: 'resume_token',
      },
    },
  },
};
