import React, { useCallback } from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const StarredMessages = () => {
  const authenticatedUserId = useUserStore((state) => state.userId);
  const { variantOverrides } = useComponentOverrides('StarredMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
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
      shouldRender={shouldRender}
      viewType={viewType}
    />
  );
};

export default StarredMessages;
