import React, { useEffect, useContext } from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { MessageAggregator } from './common/MessageAggregator';
import RCContext from '../../context/RCInstance';
import { usePinnedMessageStore, useUserStore } from '../../store';

const PinnedMessages = () => {
  const { variantOverrides } = useComponentOverrides('PinnedMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const { RCInstance } = useContext(RCContext);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const pinnedMessages = usePinnedMessageStore((state) => state.pinnedMessages);
  const setPinnedMessages = usePinnedMessageStore(
    (state) => state.setPinnedMessages
  );

  useEffect(() => {
    let cancelled = false;
    if (!isUserAuthenticated) return;
    (async () => {
      const { messages } = await RCInstance.getPinnedMessages();
      if (!cancelled) {
        setPinnedMessages(messages || []);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [RCInstance, isUserAuthenticated, setPinnedMessages]);

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
