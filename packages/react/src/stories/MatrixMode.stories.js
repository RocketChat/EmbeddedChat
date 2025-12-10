import { EmbeddedChat } from '..';

export default {
  title: 'EmbeddedChat/Matrix',
  component: EmbeddedChat,
};

export const MatrixMode = {
  args: {
    mode: 'matrix',
    host: 'https://matrix.org', // Replace with your Matrix homeserver URL
    roomId: '', // Replace with a public room ID (e.g., Matrix HQ)
    channelName: 'Matrix Room',
    headerColor: 'white',
    toastBarPosition: 'bottom right',
    showRoles: true,
    enableThreads: true,
    hideHeader: false,
    dark: false,
  },
};
