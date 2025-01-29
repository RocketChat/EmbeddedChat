import React, { useContext } from 'react';
import {
  useComponentOverrides,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import { MessageAggregator } from './common/MessageAggregator';
import RCContext from '../../context/RCInstance';

const PinnedMessages = () => {
  const { variantOverrides } = useComponentOverrides('PinnedMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const { RCInstance } = useContext(RCContext);
  const dispatchToastMessage = useToastBarDispatch();

  const unpin = async (msg) => {
    const isPinned = msg.pinned;
    const Unpin = await RCInstance.unpinMessage(msg._id);
    if (Unpin.error) {
      dispatchToastMessage({
        type: 'error',
        message: 'Error pinning message',
      });
    } else {
      dispatchToastMessage({
        type: 'success',
        message: isPinned ? 'Message unpinned' : 'Message pinned',
      });
    }
  };
  return (
    <MessageAggregator
      title="Pinned Messages"
      iconName="pin"
      unpin={unpin}
      isPinnedMessageDisplay
      noMessageInfo="No Pinned Messages"
      shouldRender={(msg) => msg.pinned}
      viewType={viewType}
    />
  );
};

export default PinnedMessages;
