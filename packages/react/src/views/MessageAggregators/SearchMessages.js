import React, { useState, useContext, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useComponentOverrides } from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { MessageAggregator } from './common/MessageAggregator';

const SearchMessages = () => {
  const { variantOverrides } = useComponentOverrides('SearchMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const { RCInstance } = useContext(RCContext);
  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [cooldown, setCooldown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const searchMessages = useCallback(async () => {
    const data = await RCInstance.getSearchMessages(text);
    if (data.success) {
      const { messages } = data;
      setMessageList(messages);
      setLoading(false);
    } else {
      setMessageList([]);
      setCooldown(true);
      setTimeout(() => {
        setCooldown(false);
      }, 20000);
    }
  }, [text, RCInstance]);

  const debouncedSearch = useCallback(
    debounce(async () => {
      await searchMessages();
    }, 500),
    [searchMessages]
  );

  useEffect(() => {
    if (cooldown) return;
    if (!text.trim()) {
      if (messageList.length > 0) {
        setMessageList([]);
      }
    } else {
      setLoading(true)
      debouncedSearch();
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [text, debouncedSearch, messageList.length, cooldown]);

  return (
    <MessageAggregator
      title="Search Messages"
      iconName="magnifier"
      noMessageInfo="No results found"
      searchProps={{
        isSearch: true,
        handleInputChange,
        placeholder: 'Search Messages',
      }}
      fetching={loading}
      searchFiltered={messageList}
      shouldRender={(msg) => !!msg}
      viewType={viewType}
    />
  );
};
export default SearchMessages;
