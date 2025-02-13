import React, { useState, useContext, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import i18n from '@embeddedchat/i18n';
import RCContext from '../../context/RCInstance';
import { MessageAggregator } from './common/MessageAggregator';

const SearchMessages = () => {
  const { variantOverrides } = useComponentOverrides('SearchMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const { RCInstance } = useContext(RCContext);
  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([]);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const searchMessages = useCallback(async () => {
    const { messages } = await RCInstance.getSearchMessages(text);
    setMessageList(messages);
  }, [text, RCInstance]);

  const debouncedSearch = useCallback(
    debounce(async () => {
      await searchMessages();
    }, 500),
    [searchMessages]
  );

  useEffect(() => {
    if (!text.trim()) {
      if (messageList.length > 0) {
        setMessageList([]);
      }
    } else {
      debouncedSearch();
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [text, debouncedSearch, messageList.length]);

  return (
    <MessageAggregator
      title={i18n.t('Search_Messages')}
      iconName="magnifier"
      noMessageInfo={i18n.t('No_Messages_Found')}
      searchProps={{
        isSearch: true,
        handleInputChange,
        placeholder: i18n.t('Search_Messages'),
      }}
      searchFiltered={messageList}
      shouldRender={(msg) => !!msg}
      viewType={viewType}
    />
  );
};
export default SearchMessages;
