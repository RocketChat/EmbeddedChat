import React, { useEffect, useMemo } from 'react';
import PinnedMessageBanner from './PinnedMessageBanner';
import { usePinnedMessageStore } from '../../store';
import RCContext from '../../context/RCInstance';

export default {
  title: 'Views/PinnedMessageBanner',
  component: PinnedMessageBanner,
};

const MockWrapper = ({ messages, showPinnedBanner = true }) => {
  const setPinnedMessages = usePinnedMessageStore(
    (state) => state.setPinnedMessages
  );
  const resetDismissedRooms = usePinnedMessageStore(
    (state) => state.resetDismissedRooms
  );

  useEffect(() => {
    resetDismissedRooms();
    setPinnedMessages(messages);
  }, [messages, resetDismissedRooms, setPinnedMessages]);

  const mockRCContext = useMemo(
    () => ({
      RCInstance: { rid: 'general' },
      ECOptions: {
        showPinnedBanner,
        roomId: 'general',
      },
    }),
    [showPinnedBanner]
  );

  return (
    <RCContext.Provider value={mockRCContext}>
      <div
        style={{
          maxWidth: 500,
          margin: '20px auto',
          border: '1px solid #ddd',
        }}
      >
        <PinnedMessageBanner />
      </div>
    </RCContext.Provider>
  );
};

export const SingleMessage = () => (
  <MockWrapper
    messages={[
      {
        _id: 'msg-1',
        msg: 'Welcome to Rocket.Chat EmbeddedChat channel!',
        u: { username: 'john_doe' },
        pinned: true,
      },
    ]}
  />
);

export const MultipleMessages = () => (
  <MockWrapper
    messages={[
      {
        _id: 'msg-1',
        msg: 'First pinned notice: Weekly sync is every Monday at 10 AM UTC.',
        u: { username: 'alice' },
        pinned: true,
      },
      {
        _id: 'msg-2',
        msg: 'Second pinned notice: Please check the contribution guidelines before opening a PR.',
        u: { username: 'bob' },
        pinned: true,
      },
      {
        _id: 'msg-3',
        msg: 'Third pinned notice: EmbeddedChat 2.0 release candidate is out!',
        u: { username: 'maintainer' },
        pinned: true,
      },
    ]}
  />
);

export const LongMessage = () => (
  <MockWrapper
    messages={[
      {
        _id: 'msg-long',
        msg: 'This is an exceptionally long announcement message that demonstrates how the pinned banner truncates text cleanly with an ellipsis at around eighty characters to preserve layout aesthetics.',
        u: { username: 'moderator' },
        pinned: true,
      },
    ]}
  />
);
