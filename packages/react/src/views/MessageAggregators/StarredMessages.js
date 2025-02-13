import React, { useCallback, useEffect } from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
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
      title={i18n.t('Starred_Messages')}
      iconName="star"
      noMessageInfo={i18n.t('No_Starred_Messages')}
      fetchedMessageList={starredMessages}
      shouldRender={shouldRender}
      viewType={viewType}
    />
  );
};

export default StarredMessages;
