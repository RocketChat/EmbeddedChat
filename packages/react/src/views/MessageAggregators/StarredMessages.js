import React, { useCallback, useContext } from 'react';
import {
  useComponentOverrides,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import { useStarredMessageStore, useUserStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';
import RCContext from '../../context/RCInstance';

const StarredMessages = () => {
  const authenticatedUserId = useUserStore((state) => state.userId);
  const { variantOverrides } = useComponentOverrides('StarredMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const starredMessages = useStarredMessageStore(
    (state) => state.starredMessages
  );
  const setStarredMessages = useStarredMessageStore(
    (state) => state.setStarredMessages
  );
  const dispatchToastMessage = useToastBarDispatch();
  const { RCInstance } = useContext(RCContext);
  const shouldRender = useCallback(
    (msg) =>
      msg.starred &&
      msg.starred.some((star) => star._id === authenticatedUserId),
    [authenticatedUserId]
  );

  const unstar = async (msg) => {
    await RCInstance.unstarMessage(msg._id);
    dispatchToastMessage({
      type: 'success',
      message: 'Message unstarred',
    });
    setStarredMessages(starredMessages.filter((str) => str._id !== msg._id));
  };

  return (
    <MessageAggregator
      title="Starred Messages"
      iconName="star"
      isStarredMessageDisplay
      unstar={unstar}
      noMessageInfo="No Starred Messages"
      fetchedMessageList={starredMessages}
      shouldRender={shouldRender}
      viewType={viewType}
    />
  );
};

export default StarredMessages;
