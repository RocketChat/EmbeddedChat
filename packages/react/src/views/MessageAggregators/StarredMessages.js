import React from 'react';
import { useStarredMessageStore, useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const StarredMessages = () => {
  const setShowStarred = useStarredMessageStore(
    (state) => state.setShowStarred
  );
  const authenticatedUserId = useUserStore((state) => state.userId);

  return (
    <MessageAggregator
      title="Starred Messages"
      iconName="star"
      noMessageInfo="No Starred Messages"
      setShowWindow={setShowStarred}
      shouldRender={(msg) =>
        msg.starred &&
        msg.starred.some((star) => star._id === authenticatedUserId)
      }
    />
  );
};

export default StarredMessages;
