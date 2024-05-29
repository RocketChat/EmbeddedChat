import { EmbeddedChat } from '../..';
import MintMeadow from '../../theme/CurveVariant/MintMeadow';
import RoseEmber from '../../theme/CurveVariant/RoseEmber';

export default {
  title: 'EmbeddedChat/Design Variants/CurveVariant/Colorful',
  component: EmbeddedChat,
};

export const Mint_Meadow = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: 'GENERAL',
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: false,
    showAvatar: true,
    showUsername: false,
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
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: false,
    showUsername: false,
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
