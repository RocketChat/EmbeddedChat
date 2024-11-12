import React, { useCallback, useEffect } from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { useStarredMessageStore, useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const StarredMessages = () => {
  const authenticatedUserId = useUserStore((state) => state.userId);
  const { variantOverrides } = useComponentOverrides('StarredMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const starredMessages = useStarredMessageStore(
    (state) => state.starredMessages
  );
  const shouldRender = useCallback(
    (msg) =>
      msg.starred &&
      msg.starred.some((star) => star._id === authenticatedUserId),
    [authenticatedUserId]
  );
  return (
    <MessageAggregator
      title="Starred Messages"
      iconName="star"
      noMessageInfo="No Starred Messages"
      fetchedMessageList={starredMessages}
      shouldRender={shouldRender}
      viewType={viewType}
    />
  );
};

export default StarredMessages;
