import React, { useState, useMemo } from 'react';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
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
      messages.filter((message) =>
        message.msg?.toLowerCase().includes(text.toLowerCase())
      ),
    [messages, text]
  );

  return (
    <MessageAggregator
      title={i18n.t('Threads')}
      iconName="thread"
      noMessageInfo={i18n.t('No_Threads_Found')}
      searchProps={{
        isSearch: true,
        handleInputChange,
        placeholder: i18n.t('Search_Threads'),
      }}
      searchFiltered={searchFiltered}
      shouldRender={(msg) => !msg.t && msg.tcount}
      viewType={viewType}
    />
  );
};

export default ThreadedMessages;
