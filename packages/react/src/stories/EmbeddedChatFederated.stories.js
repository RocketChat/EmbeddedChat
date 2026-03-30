import React, { useEffect } from 'react';
import { EmbeddedChat } from '..';
import useMessageStore from '../store/messageStore';

const MOCK_MATRIX_MESSAGES = [
  {
    _id: 'matrix-msg-1',
    msg: 'Hey everyone, just joined from Element. Can someone help me set up notifications?',
    ts: new Date(Date.now() - 300000).toISOString(),
    u: { _id: 'mx-alice', username: '@alice:matrix.org', name: 'Alice' },
    rid: 'GENERAL',
    _updatedAt: new Date(Date.now() - 300000).toISOString(),
  },
  {
    _id: 'matrix-msg-2',
    msg: 'Thanks! That worked. Also, is there a way to share files across the bridge?',
    ts: new Date(Date.now() - 120000).toISOString(),
    u: { _id: 'mx-alice', username: '@alice:matrix.org', name: 'Alice' },
    rid: 'GENERAL',
    _updatedAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    _id: 'matrix-msg-3',
    msg: 'I can confirm the bridge is working on our end. Messages sync fine.',
    ts: new Date(Date.now() - 180000).toISOString(),
    u: { _id: 'mx-bob', username: '@bob:element.io', name: 'Bob' },
    rid: 'GENERAL',
    _updatedAt: new Date(Date.now() - 180000).toISOString(),
  },
  {
    _id: 'matrix-msg-4',
    msg: 'Checking in from our homeserver. Reactions and threads seem to work too.',
    ts: new Date(Date.now() - 60000).toISOString(),
    u: { _id: 'mx-carol', username: '@carol:mozilla.org', name: 'Carol' },
    rid: 'GENERAL',
    _updatedAt: new Date(Date.now() - 60000).toISOString(),
  },
];

const InjectMatrixMessages = ({ children }) => {
  const upsertMessage = useMessageStore((s) => s.upsertMessage);
  const messages = useMessageStore((s) => s.messages);

  useEffect(() => {
    if (messages.length === 0) return;
    const hasInjected = messages.some((m) => m._id === 'matrix-msg-1');
    if (hasInjected) return;

    const timer = setTimeout(() => {
      MOCK_MATRIX_MESSAGES.forEach((m) => upsertMessage(m));
    }, 2000);
    return () => clearTimeout(timer);
  }, [messages, upsertMessage]);

  return children;
};

export default {
  title: 'EmbeddedChat/Federated (Matrix)',
  component: EmbeddedChat,
  decorators: [
    (Story) => (
      <InjectMatrixMessages>
        <Story />
      </InjectMatrixMessages>
    ),
  ],
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
    auth: { flow: 'PASSWORD' },
    dark: false,
    federation: true,
  },
};

