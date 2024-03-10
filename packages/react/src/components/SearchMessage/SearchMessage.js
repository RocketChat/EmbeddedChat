import React, { useState, useContext, useEffect } from 'react';
import { isSameDay, format } from 'date-fns';
import { debounce } from 'lodash';
import RCContext from '../../context/RCInstance';
import classes from './SearchMessage.module.css';
import { Markdown } from '../Markdown/index';
import { useUserStore, useSearchMessageStore } from '../../store';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { MessageDivider } from '../Message/MessageDivider';
import { Message } from '../Message';

const Search = () => {
  const { RCInstance } = useContext(RCContext);
  const setShowSearch = useSearchMessageStore((state) => state.setShowSearch);

  const toggleShowSearch = () => {
    setShowSearch(false);
  };

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
  }, 500); // 500ms delay

  useEffect(() => {
    if (!text.trim()) {
      if (messageList.length > 0) {
        setMessageList([]);
      }
    } else {
      debouncedSearch();
    }

    // Cleanup function to cancel the debounce on component unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [text, debouncedSearch, messageList.length]);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <Box className={classes.searchBar} style={{ padding: '1rem' }}>
      <Box className={classes.wrapContainer}>
        <Box
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ display: 'contents' }}>
            <Icon name="magnifier" size="1.25rem" />
            <Box style={{ color: '#4a4a4a', width: '80%' }}>
              Search Messages
            </Box>
            <ActionButton onClick={toggleShowSearch} ghost size="small">
              <Icon name="cross" />
            </ActionButton>
          </h3>
        </Box>
        <Box
          className={classes.container}
          style={{
            border: '2px solid #ddd',
            position: 'relative',
            marginBottom: '1rem',
          }}
        >
          <input
            placeholder="Search Message"
            onChange={handleInputChange}
            className={classes.textInput}
          />

          <Icon
            name="magnifier"
            size="1.25rem"
            style={{ padding: '0.125em', cursor: 'pointer' }}
          />
        </Box>
        <Box
          style={{
            flex: '1',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: messageList.length === 0 ? 'center' : 'initial',
            alignItems: messageList.length === 0 ? 'center' : 'initial',
          }}
        >
          {messageList.length === 0 ? (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#4a4a4a',
              }}
            >
              <Icon
                name="magnifier"
                size="3rem"
                style={{ padding: '0.5rem' }}
              />
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                No results found
              </span>
            </Box>
          ) : (
            messageList.map((msg, index, arr) => {
              const prev = arr[index + 1];
              const newDay = isMessageNewDay(msg, prev);
              return (
                <Box key={msg._id}>
                  {newDay && (
                    <Box style={{ paddingTop: '0.5rem' }}>
                      <MessageDivider>
                        {format(new Date(msg.ts), 'MMMM d, yyyy')}
                      </MessageDivider>
                    </Box>
                  )}
                  <Message
                    key={msg._id}
                    message={msg}
                    newDay={false}
                    sequential={false}
                    variant="default"
                    showAvatar
                    showToolbox={false}
                  />
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default Search;
