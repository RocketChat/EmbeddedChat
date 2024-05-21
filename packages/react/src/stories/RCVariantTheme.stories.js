import { EmbeddedChat } from '..';
import AzureSky from '../theme/AzureSky';
import DefaultTheme from '../theme/DefaultTheme';
import MintMeadow from '../theme/MintMeadow';
import RoseEmber from '../theme/RoseEmber';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
export default {
  title: 'EmbeddedChat/Variant/RCVariant',
  component: EmbeddedChat,
};

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args

export const Default = {
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

export const Mint_Meadow = {
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
    theme: MintMeadow,
    auth: {
      flow: 'PASSWORD',
    },
    dark: false,
  },
};

export const Rose_Ember = {
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
    theme: RoseEmber,
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
