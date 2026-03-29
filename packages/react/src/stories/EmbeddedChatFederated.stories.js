import { EmbeddedChat } from '..';

export default {
  title: 'EmbeddedChat/Federated (Matrix)',
  component: EmbeddedChat,
};

/**
 * Connect to a Matrix-bridged Rocket.Chat room.
 *
 * Set env vars before running Storybook:
 *   STORYBOOK_RC_HOST=http://your-rc-server:3000
 *   STORYBOOK_FEDERATED_ROOM_ID=<room-id-with-federation-enabled>
 *
 * What this demonstrates with federation={true}:
 *   - FederationBanner appears below the header when the room is federated
 *   - Matrix users (@user:homeserver.tld) show coloured initials avatars
 *   - Green "Matrix" badge next to sender name in every message
 *   - Full @user:homeserver shown as username in message header
 *   - Non-Matrix (RC) users render normally — no changes to existing behaviour
 */
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
    auth: { flow: 'PASSWORD' },
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

export const FederatedRoomAnonymous = {
  args: {
    ...FederatedRoom.args,
    anonymousMode: true,
    channelName: 'federated-room (anonymous)',
  },
};
