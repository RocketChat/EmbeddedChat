import { EmbeddedChat } from '../..';
import AzureSky from '../../theme/CurveVariant/AzureSky';
import Simple from '../../theme/CurveVariant/Simple';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'EmbeddedChat/Design Variants/CurveVariant/Simplistic',
  component: EmbeddedChat,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Default = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: 'GENERAL',
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: false,
    showUsername: false,
    showAvatar: true,
    enableThreads: true,
    hideHeader: false,
    theme: Simple,
    auth: {
      flow: 'PASSWORD',
    },
    dark: false,
  },
};

export const Azure_Sky = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: 'GENERAL',
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: false,
    showUsername: false,
    showAvatar: true,
    enableThreads: true,
    hideHeader: false,
    theme: AzureSky,
    auth: {
      flow: 'PASSWORD',
    },
    dark: false,
  },
};
