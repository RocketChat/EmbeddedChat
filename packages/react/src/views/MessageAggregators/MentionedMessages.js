import React from 'react';
import { useMentionsStore, useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const MentionedMessages = () => {
  const setShowMentions = useMentionsStore((state) => state.setShowMentions);
  const authenticatedUserId = useUserStore((state) => state.userId);

  return (
    <MessageAggregator
      title="Mentions"
      iconName="at"
      noMessageInfo="No mentions found"
      setShowWindow={setShowMentions}
      shouldRender={(msg) =>
        msg.mentions &&
        msg.mentions.some((star) => star._id === authenticatedUserId)
      }
    />
  );
};

export default MentionedMessages;
