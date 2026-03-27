import { EmbeddedChat } from '..';

export default {
  title: 'EmbeddedChat/Federated (Matrix)',
  component: EmbeddedChat,
};

export const FederatedRoom = {
  args: {
    host: process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
    roomId: process.env.STORYBOOK_FEDERATED_ROOM_ID || 'GENERAL',
    channelName: 'federated-room',
    anonymousMode: false,
    toastBarPosition: 'bottom right',
    showRoles: true,
    showUsername: true,
    enableThreads: true,
    hideHeader: false,
    auth: {
      flow: 'PASSWORD',
    },
    dark: false,
    federation: true,
  },
};

export const FederatedRoomDark = {
  args: {
    ...FederatedRoom.args,
    dark: true,
    channelName: 'federated-room (dark)',
  },
};
