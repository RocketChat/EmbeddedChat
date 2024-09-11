import { EmbeddedChat } from '../..';
import MintMeadow from '../../theme/MintMeadow';
import RoseEmber from '../../theme/RoseEmber';

export default {
  title: 'EmbeddedChat/Design Variants/RCVariant/Colorful',
  component: EmbeddedChat,
};

export const Mint_Meadow = {
  title: 'Colorful/MintMeadow',
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
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
  title: 'EmbeddedChat/Variant/RCVariant/Colorful/RoseEmber',
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: 'GENERAL',
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
