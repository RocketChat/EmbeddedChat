import React, { useCallback } from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { useStarredMessageStore, useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';
import scrollToMessage from '../../lib/scrollToMessage';

const StarredMessages = () => {
  const authenticatedUserId = useUserStore((state) => state.userId);
  const { variantOverrides } = useComponentOverrides('StarredMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';

  const {
    starredMessages,
    jumpToMessage,
    isJumping,
  } = useStarredMessageStore();

  const shouldRender = useCallback(
    (msg) =>
      msg.starred &&
      msg.starred.some((star) => star._id === authenticatedUserId),
    [authenticatedUserId]
  );

  const handleJumpToMessage = async (message) => {
    if (!message?._id || isJumping) return;

    await jumpToMessage(message._id);
    scrollToMessage(message._id);
  };

  return (
    <MessageAggregator
      title="Starred Messages"
      iconName="star"
      noMessageInfo="No Starred Messages"
      fetchedMessageList={starredMessages}
      shouldRender={shouldRender}
      viewType={viewType}
      onJumpToMessage={handleJumpToMessage}
    />
  );
};

export default StarredMessages;
