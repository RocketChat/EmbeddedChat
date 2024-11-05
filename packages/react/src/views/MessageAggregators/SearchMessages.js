import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import debounce from 'lodash/debounce';
import { useComponentOverrides, useTheme } from '@embeddedchat/ui-elements';
import { css } from '@emotion/react';
import RCContext from '../../context/RCInstance';
import { MessageAggregator } from './common/MessageAggregator';

const SearchMessages = () => {
  const { variantOverrides } = useComponentOverrides('SearchMessages');
  const viewType = variantOverrides.viewType || 'Sidebar';
  const { RCInstance } = useContext(RCContext);
  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [error, setError] = useState(null);

  const { theme } = useTheme();

  const requestCount = useRef(0);
  const lastRequestTime = useRef(0);
  const requestInterval = 1000;

  const handleInputChange = (e) => {
    setText(e.target.value);
    setError(null);
  };

  const searchMessages = useCallback(async () => {
    const presentTime = Date.now();
    if (presentTime - lastRequestTime.current < requestInterval) {
      return;
    }

    requestCount.current += 1;
    lastRequestTime.current = presentTime;

    try {
      const { messages } = await RCInstance.getSearchMessages(text);
      setMessageList(messages || []);
      requestCount.current -= 1;
    } catch (err) {
      if (err?.status === 429) {
        const retryAfter = parseInt(
          err.headers?.get('Retry-After') || '30',
          10
        );
        setError(`Please wait ${retryAfter} seconds`);
        setMessageList([]);
      } else {
        setError('Failed to search messages');
      }
      requestCount.current -= 1;
    }
  }, [text, RCInstance]);

  const debouncedSearch = useCallback(
    debounce(async () => {
      if (requestCount.current > 0) {
        return;
      }
      await searchMessages();
    }, 500),
    [searchMessages]
  );

  useEffect(() => {
    if (!text.trim()) {
      if (messageList.length > 0) {
        setMessageList([]);
      }
      setError(null);
    } else {
      debouncedSearch();
    }
    return () => {
      debouncedSearch.cancel();
      requestCount.current = 0;
      lastRequestTime.current = 0;
    };
  }, [text, debouncedSearch, messageList.length]);

  return (
    <>
      <MessageAggregator
        title="Search Messages"
        iconName="magnifier"
        noMessageInfo="No results found"
        searchProps={{
          isSearch: true,
          handleInputChange,
          placeholder: 'Search Messages',
        }}
        searchFiltered={messageList}
        shouldRender={(msg) => !!msg}
        viewType={viewType}
      />
      {error && (
        <div
          css={css`
            color: ${theme.colors.destructive};
            font-size: 13px;
          `}
        >
          {error}
        </div>
      )}
    </>
  );
};
export default SearchMessages;
