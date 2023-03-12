import React, { useState, useContext } from 'react';
import { isSameDay, format } from 'date-fns';
import {
  Box,
  Icon,
  ActionButton,
  Message,
  MessageReactions,
  MessageDivider,
  Button,
} from '@rocket.chat/fuselage';
import RCContext from '../../context/RCInstance';
import classes from './SearchMessage.module.css';
import { Markdown } from '../Markdown/index';
import { useUserStore, useSearchMessageStore } from '../../store';
import { isSameUser, serializeReactions } from '../../lib/reaction';
import ThemeContext from '../../context/ThemeContext';
import { lighten } from '../../lib/color';

const Search = () => {
  const { RCInstance } = useContext(RCContext);
  const { primaryColor } = useContext(ThemeContext);
  const computedBackgroundColor = lighten(primaryColor, 0.3);
  const setShowSearch = useSearchMessageStore((state) => state.setShowSearch);
  const authenticatedUserUsername = useUserStore((state) => state.username);

  const toggleShowSearch = () => {
    setShowSearch(false);
  };
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const [text, setText] = useState('');
  const [messageList, setMessageList] = useState([]);

  const searchMessages = async () => {
    const { messages } = await RCInstance.getSearchMessages(text);
    setMessageList(messages);
  };

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <Box
      className={classes.searchBar}
      p="x16"
      backgroundColor={computedBackgroundColor}
    >
      <Box display="flex" is="h3">
        <Icon name="magnifier" size="x24" padding="0px 20px 20px 0px" />
        <Box width="80%" style={{ color: '#4a4a4a' }}>
          Search Messages
        </Box>
        <ActionButton
          onClick={toggleShowSearch}
          ghost
          display="inline"
          square
          small
        >
          <Icon name="cross" size="x20" />
        </ActionButton>
      </Box>
      <Box className={classes.container} border="2px solid #ddd">
        <Icon name="magnifier" size="x24" padding={6} />
        <input
          placeholder="Search Message"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13) searchMessages();
          }}
          className={classes.textInput}
        />
        <Button small onClick={searchMessages}>
          Enter
        </Button>
      </Box>
      {messageList &&
        messageList.map((msg, index, arr) => {
          const prev = arr[index + 1];
          const newDay = isMessageNewDay(msg, prev);
          return (
            <Message key={msg._id}>
              <Message.Container>
                {newDay && (
                  <MessageDivider>
                    {format(new Date(msg.ts), 'MMMM d, yyyy')}
                  </MessageDivider>
                )}
                <Message.Header>
                  <Message.Name>{msg.u.username}</Message.Name>
                  <Message.Timestamp>
                    {format(new Date(msg.ts), 'h:mm a')}
                  </Message.Timestamp>
                  {msg.editedAt && (
                    <Icon mie="x4" opacity={0.5} name="edit" size="x16" />
                  )}
                </Message.Header>
                <Message.Body>
                  <Markdown body={msg} />
                </Message.Body>
                <MessageReactions>
                  {msg.reactions &&
                    serializeReactions(msg.reactions).map((reaction) => (
                      <MessageReactions.Reaction
                        key={reaction.name}
                        mine={isSameUser(reaction, authenticatedUserUsername)}
                      >
                        <Markdown body={reaction.name} />
                        <p>{reaction.count}</p>
                      </MessageReactions.Reaction>
                    ))}
                </MessageReactions>
              </Message.Container>
            </Message>
          );
        })}
    </Box>
  );
};
export default Search;
