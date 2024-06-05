import React, { useState, useMemo } from 'react';

import { useThreadsMessageStore, useMessageStore } from '../../store';

import { MessageAggregator } from './common/MessageAggregator';

const ThreadedMessages = () => {
  const setShowAllThreads = useThreadsMessageStore(
    (state) => state.setShowAllThreads
  );
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
      setShowWindow={setShowAllThreads}
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
