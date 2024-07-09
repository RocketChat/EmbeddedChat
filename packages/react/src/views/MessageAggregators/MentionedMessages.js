import React from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const MentionedMessages = () => {
  const authenticatedUserId = useUserStore((state) => state.userId);
  const { variantOverrides } = useComponentOverrides('MentionedMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  return (
    <MessageAggregator
      title="Mentions"
      iconName="at"
      noMessageInfo="No mentions found"
      shouldRender={(msg) =>
        msg.mentions &&
        msg.mentions.some((star) => star._id === authenticatedUserId)
      }
      viewType={viewType}
    />
  );
};

export default MentionedMessages;
