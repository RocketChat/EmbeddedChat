import React from 'react';
import { MessageAggregator } from './common/MessageAggregator';

const PinnedMessages = () => (
  <MessageAggregator
    title="Pinned Messages"
    iconName="pin"
    noMessageInfo="No Pinned Messages"
    shouldRender={(msg) => msg.pinned}
  />
);

export default PinnedMessages;
