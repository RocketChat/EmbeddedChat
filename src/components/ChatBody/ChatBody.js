import { Box, Message, MessageToolbox } from '@rocket.chat/fuselage';
import React, { useContext, useEffect } from 'react';
import styles from './ChatBody.module.css';
import PropTypes from 'prop-types';
import { EmojiPicker } from '../EmojiPicker/index';
import Popup from 'reactjs-popup';
import { Markdown } from '../Markdown/index';
import { useMediaQuery } from '@rocket.chat/fuselage-hooks';
import RCContext from '../../context/RCInstance';
import { useMessageStore, useUserStore } from '../../store';

const ChatBody = ({ height, anonymousMode }) => {
  const { RCInstance } = useContext(RCContext);
  const isSmallScreen = useMediaQuery('(max-width: 992px)');

  const messages = useMessageStore((state) => state.messages);
  const setMessages = useMessageStore((state) => state.setMessages);

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  useEffect(() => {
    async function getMessages(anonymousMode) {
      const data = await RCInstance.getMessages(anonymousMode);
      if (data.messages) {
        setMessages(data.messages);
        if (!anonymousMode) {
          setIsUserAuthenticated(true);
        }
      } else {
        setIsUserAuthenticated(false);
      }
    }
    RCInstance.realtime(getMessages);
    if (isUserAuthenticated) {
      getMessages(!anonymousMode);
    } else {
      getMessages(anonymousMode);
    }

    return () => RCInstance.close();
  }, []);

  const handleEmojiClick = (_, e) => {
    let emoji = `:${e.name}:`;
    console.log(emoji);
  };

  return (
    <Box className={styles.container} height={height}>
      {messages &&
        messages.length &&
        messages.map((msg) => (
          <Message key={msg._id}>
            <Message.Container>
              <Message.Header>
                <Message.Name>{msg.u?.name}</Message.Name>
                <Message.Username>@{msg.u.username}</Message.Username>
                <Message.Timestamp>
                  {new Date(msg.ts).toDateString()}
                </Message.Timestamp>
              </Message.Header>
              <Message.Body>
                <Markdown body={msg.msg} />
              </Message.Body>
            </Message.Container>
            <MessageToolbox.Wrapper>
              <MessageToolbox>
                <MessageToolbox.Item icon="thread" />
                <MessageToolbox.Item icon="star" />
                <Popup
                  trigger={
                    <MessageToolbox.Item
                      icon="emoji"
                      onClick={() => console.log('saf')}
                    />
                  }
                  position={isSmallScreen ? 'left top' : 'left center'}
                >
                  <EmojiPicker handleEmojiClick={handleEmojiClick} />
                </Popup>
                <MessageToolbox.Item icon="pin" />
              </MessageToolbox>
            </MessageToolbox.Wrapper>
          </Message>
        ))}
    </Box>
  );
};

export default ChatBody;

ChatBody.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anonymousMode: PropTypes.bool,
};
