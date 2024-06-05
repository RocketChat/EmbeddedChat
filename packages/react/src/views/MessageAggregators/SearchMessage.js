import React, { useState, useContext, useEffect } from 'react';
import { debounce } from 'lodash';
import RCContext from '../../context/RCInstance';
import { useSearchMessageStore } from '../../store';
import { MessageAggregator } from './common/MessageAggregator';

const Search = () => {
  const { RCInstance } = useContext(RCContext);
  const setShowSearch = useSearchMessageStore((state) => state.setShowSearch);

  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([]);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const searchMessages = async () => {
    const { messages } = await RCInstance.getSearchMessages(text);
    setMessageList(messages);
  };

  const debouncedSearch = debounce(async () => {
    await searchMessages();
  }, 500);

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
      title="Search Messages"
      iconName="magnifier"
      noMessageInfo="No results found"
      setShowWindow={setShowSearch}
      searchProps={{
        isSearch: true,
        handleInputChange,
        placeholder: 'Search Messages',
      }}
      searchFiltered={messageList}
      shouldRender={(msg) => !!msg}
    />
  );
};
export default Search;
