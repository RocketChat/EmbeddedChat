import React from 'react';
import { useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const StarredMessages = () => {
  const authenticatedUserId = useUserStore((state) => state.userId);

  return (
    <MessageAggregator
      title="Starred Messages"
      iconName="star"
      noMessageInfo="No Starred Messages"
      shouldRender={(msg) =>
        msg.starred &&
        msg.starred.some((star) => star._id === authenticatedUserId)
      }
    />
  );
};

export default StarredMessages;
