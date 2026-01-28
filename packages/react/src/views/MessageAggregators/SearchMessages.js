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

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const searchMessages = useCallback(async () => {
    try {
      // it is capture all responce first and prevent the crash (Error)
      const response = await RCInstance.getSearchMessages(text);

      //  using the optional chaining and fallback empty array([])
      setMessageList(response?.messages || []);
    } catch (error) {
      // this is prevent the red-box UI crash , that meens the server are available Until Error (400/429) are Occurs
      console.error("Search API Error:", error);
      setMessageList([]);
    }
  }, [text, RCInstance]);

  const debouncedSearch = useCallback(
    debounce(async () => {
      await searchMessages();
    }, 500),
    [searchMessages]
  );

  useEffect(() => {
    if (!text.trim()) {
      // make sure the even check to be safe 
      if (messageList?.length > 0) {
        setMessageList([]);
      }
    } else {
      debouncedSearch();
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [text, debouncedSearch, messageList?.length]);

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
      // ensure prop is never undefined
      searchFiltered={messageList || []}
      shouldRender={(msg) => !!msg}
      viewType={viewType}
    />
  );
};
export default SearchMessages;