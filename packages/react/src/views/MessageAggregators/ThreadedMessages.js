import React, { useState, useMemo } from 'react';

import { useComponentOverrides } from '@embeddedchat/ui-elements';
import { useMessageStore } from '../../store';

import { MessageAggregator } from './common/MessageAggregator';

const ThreadedMessages = () => {
  const messages = useMessageStore((state) => state.messages);
  const { variantOverrides } = useComponentOverrides('ThreadedMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const [text, setText] = useState('');

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const searchFiltered = useMemo(
    () =>
      messages
        .filter((message) =>
          message.msg?.toLowerCase().includes(text.toLowerCase())
        )
        .sort((a, b) => {
          const dateA = a.tlm ? new Date(a.tlm) : new Date(0); 
          const dateB = b.tlm ? new Date(b.tlm) : new Date(0);
          return dateB - dateA; 
        }),
    [messages, text]
  );
  
  return (
    <MessageAggregator
      title="Threads"
      iconName="thread"
      noMessageInfo="No threads found"
      searchProps={{
        isSearch: true,
        handleInputChange,
        placeholder: 'Search Threads',
      }}
      searchFiltered={searchFiltered}
      shouldRender={(msg) => !msg.t && msg.tcount}
      viewType={viewType}
    />
  );
};

export default ThreadedMessages;
