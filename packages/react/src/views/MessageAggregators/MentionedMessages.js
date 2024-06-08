import React from 'react';
import { useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const MentionedMessages = () => {
  const authenticatedUserId = useUserStore((state) => state.userId);

  return (
    <MessageAggregator
      title="Mentions"
      iconName="at"
      noMessageInfo="No mentions found"
      shouldRender={(msg) =>
        msg.mentions &&
        msg.mentions.some((star) => star._id === authenticatedUserId)
      }
    />
  );
};

export default MentionedMessages;
