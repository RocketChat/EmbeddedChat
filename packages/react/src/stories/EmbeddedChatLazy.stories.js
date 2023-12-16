import React from 'react';
import { EmbeddedChat } from '..';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'EmbeddedChat/LazyLoad',
  component: EmbeddedChat,
};

// More on writing stories with args:  https://storybook.js.org/docs/react/writing-stories/args
export const Simple = {
  args: {
    fallback: <div>Loading...</div>,
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: 'GENERAL',
    isClosable: true,
    setClosableState: true,
    moreOpts: true,
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: true,
    showAvatar: true,
    enableThreads: true,
    auth: {
      flow: 'PASSWORD',
    },
  },
};
