import React from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const StarredMessages = () => {
  const authenticatedUserId = useUserStore((state) => state.userId);
  const { variantOverrides } = useComponentOverrides('StarredMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  return (
    <MessageAggregator
      title="Starred Messages"
      iconName="star"
      noMessageInfo="No Starred Messages"
      shouldRender={(msg) =>
        msg.starred &&
        msg.starred.some((star) => star._id === authenticatedUserId)
      }
      viewType={viewType}
    />
  );
};

export default StarredMessages;
