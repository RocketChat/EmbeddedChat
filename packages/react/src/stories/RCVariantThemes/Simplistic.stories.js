import { EmbeddedChat } from '../..';
import AzureSky from '../../theme/AzureSky';
import DefaultTheme from '../../theme/DefaultTheme';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'EmbeddedChat/Design Variants/RCVariant/Simplistic',
  component: EmbeddedChat,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Default = {
  title: 'EmbeddedChat/Variant/RCVariant/Simplistic/Default',
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: 'GENERAL',
    moreOpts: true,
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: true,
    showAvatar: true,
    enableThreads: true,
    hideHeader: false,
    theme: DefaultTheme,
    auth: {
      flow: 'PASSWORD',
    },
    dark: false,
  },
};

export const Azure_Sky = {
  title: 'EmbeddedChat/Variant/RCVariant/Simplistic/AzureSky',
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: 'GENERAL',
    moreOpts: true,
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: true,
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
