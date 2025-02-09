import React from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { MessageAggregator } from './common/MessageAggregator';
import { usePinnedMessageStore } from '../../store';

const PinnedMessages = () => {
  const { variantOverrides } = useComponentOverrides('PinnedMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const pinnedMessages = usePinnedMessageStore((state) => state.PinnedMessage);
  return (
    <MessageAggregator
      title="Pinned Messages"
      iconName="pin"
      noMessageInfo="No Pinned Messages"
      fetchedMessageList={pinnedMessages}
      shouldRender={(msg) => msg.pinned}
      viewType={viewType}
    />
  );
};

export default PinnedMessages;
