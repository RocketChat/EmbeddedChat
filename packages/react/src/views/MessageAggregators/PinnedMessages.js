import React from 'react';
import { usePinnedMessageStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const PinnedMessages = () => {
  const setShowPinned = usePinnedMessageStore((state) => state.setShowPinned);

  return (
    <MessageAggregator
      title="Pinned Messages"
      iconName="pin"
      noMessageInfo="No Pinned Messages"
      setShowWindow={setShowPinned}
      shouldRender={(msg) => msg.pinned}
    />
  );
};

export default PinnedMessages;
