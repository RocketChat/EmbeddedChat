import React from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { MessageAggregator } from './common/MessageAggregator';

const PinnedMessages = () => {
  const { variantOverrides } = useComponentOverrides('PinnedMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  return (
    <MessageAggregator
      title="Pinned Messages"
      iconName="pin"
      noMessageInfo="No Pinned Messages"
      shouldRender={(msg) => msg.pinned}
      viewType={viewType}
    />
  );
};

export default PinnedMessages;
