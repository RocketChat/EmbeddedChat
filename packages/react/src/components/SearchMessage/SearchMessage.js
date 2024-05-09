import React, { useState, useContext, useEffect } from 'react';
import { css } from '@emotion/react';
import { isSameDay, format } from 'date-fns';
import { debounce } from 'lodash';
import RCContext from '../../context/RCInstance';
import { useSearchMessageStore } from '../../store';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { MessageDivider } from '../Message/MessageDivider';
import { Message } from '../Message';
import Sidebar from '../Sidebar/Sidebar';
import { Input } from '../Input';

const searchContainer = css`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 0.25rem;
  position: relative;
  margin: 0 1rem 1rem;
`;

const textInput = css`
  border: none;
  flex: none;
  padding: none;
  &:focus {
    border: none;
    box-shadow: none;
  }
`;

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
  }, 500); // 500ms delay

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

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <Sidebar
      title="Search Messages"
      iconName="magnifier"
      setShowWindow={setShowSearch}
    >
      <Box
        css={searchContainer}
        style={{
          border: '2px solid #ddd',
          position: 'relative',
          marginBottom: '1rem',
        }}
      >
        <Input
          placeholder="Search Message"
          onChange={handleInputChange}
          css={textInput}
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
          overflowX: 'hidden',
          maxWidth: '100%',
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
            <Icon name="magnifier" size="3rem" style={{ padding: '0.5rem' }} />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              No results found
            </span>
          </Box>
        ) : (
          messageList.map((msg, index, arr) => {
            const newDay = index === 0 || isMessageNewDay(msg, arr[index - 1]);
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
    </Sidebar>
  );
};
export default Search;
