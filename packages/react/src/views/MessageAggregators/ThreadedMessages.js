import React, { useState, useMemo } from 'react';

import { useMessageStore } from '../../store';

import { MessageAggregator } from './common/MessageAggregator';

const ThreadedMessages = () => {
  const messages = useMessageStore((state) => state.messages);
  const [text, setText] = useState('');

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const searchFiltered = useMemo(
    () =>
      messages.filter((message) =>
        message.msg.toLowerCase().includes(text.toLowerCase())
      ),
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
    />
  );
};

export default ThreadedMessages;
