import { EmbeddedChat } from '..';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'EmbeddedChat/WithAuthToken',
  component: EmbeddedChat,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Simple = {
  args: {
    host: 'http://localhost:3000',
    roomId: 'GENERAL',
    GOOGLE_CLIENT_ID: '',
    isClosable: true,
    setClosableState: true,
    moreOpts: true,
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
        resume: 'AQGOHBtHBtCdgITotRHOCPVJoWEMMg3JETIeYfrqvhl',
      },
    },
  },
};
