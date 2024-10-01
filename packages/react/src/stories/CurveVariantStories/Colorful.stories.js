import { EmbeddedChat } from '../..';
import AquaBreeze from '../../theme/CurveVariant/AquaBreeze';
import BlushCandy from '../../theme/CurveVariant/BlushCandy';

export default {
  title: 'EmbeddedChat/Design Variants/CurveVariant/Colorful',
  component: EmbeddedChat,
};

export const Aqua_Breeze = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.RC_ROOM_ID || 'GENERAL',
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: false,
    showAvatar: true,
    enableThreads: true,
    hideHeader: false,
    theme: AquaBreeze,
    auth: {
      flow: 'PASSWORD',
    },
    dark: false,
  },
};

export const Blush_Candy = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: 'GENERAL',
    channelName: 'general',
    anonymousMode: true,
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: false,
    showAvatar: true,
    enableThreads: true,
    hideHeader: false,
    theme: BlushCandy,
    auth: {
      flow: 'PASSWORD',
    },
    dark: false,
  },
};
