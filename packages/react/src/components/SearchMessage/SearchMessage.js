import React, { useState, useContext } from 'react';
import { isSameDay, format } from 'date-fns';
import RCContext from '../../context/RCInstance';
import classes from './SearchMessage.module.css';
import { Markdown } from '../Markdown/index';
import { useUserStore, useSearchMessageStore } from '../../store';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { MessageContainer } from '../Message/MessageContainer';
import { MessageDivider } from '../Message/MessageDivider';
import { MessageReactions } from '../Message/MessageReactions';
import MessageHeader from '../Message/MessageHeader';
import { MessageBody } from '../Message/MessageBody';
import MessageBodyContainer from '../Message/MessageBodyContainer';

const Search = () => {
  const { RCInstance } = useContext(RCContext);
  const setShowSearch = useSearchMessageStore((state) => state.setShowSearch);
  const authenticatedUserUsername = useUserStore((state) => state.username);

  const toggleShowSearch = () => {
    setShowSearch(false);
  };

  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([]);

  const searchMessages = async () => {
    const { messages } = await RCInstance.getSearchMessages(text);
    setMessageList(messages);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchMessages();
    }
  };

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <Box className={classes.searchBar} style={{ padding: '1rem' }}>
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
          <Box style={{ color: '#4a4a4a', width: '80%' }}>Search Messages</Box>
          <ActionButton onClick={toggleShowSearch} ghost size="small">
            <Icon name="cross" size="x20" />
          </ActionButton>
        </h3>
      </Box>
      <Box
        className={classes.container}
        style={{ border: '2px solid #ddd', position: 'relative' }}
      >
        <input
          placeholder="Search Message"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
          className={classes.textInput}
        />

        <Icon
          name="magnifier"
          size="1.25rem"
          style={{ padding: '0.125em', cursor: 'pointer' }}
          onClick={searchMessages}
        />
      </Box>
      {messageList &&
        messageList.map((msg, index, arr) => {
          const prev = arr[index + 1];
          const newDay = isMessageNewDay(msg, prev);
          return (
            <React.Fragment key={msg._id}>
              {newDay && (
                <MessageDivider>
                  {format(new Date(msg.ts), 'MMMM d, yyyy')}
                </MessageDivider>
              )}
              <MessageContainer>
                <MessageBodyContainer>
                  <MessageHeader message={msg} />
                  <MessageBody>
                    <Markdown body={msg} />
                  </MessageBody>
                  <MessageReactions
                    authenticatedUserUsername={authenticatedUserUsername}
                    message={msg}
                  />
                </MessageBodyContainer>
              </MessageContainer>
            </React.Fragment>
          );
        })}
    </Box>
  );
};
export default Search;
