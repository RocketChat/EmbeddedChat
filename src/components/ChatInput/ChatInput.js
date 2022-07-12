import { Box, Icon } from '@rocket.chat/fuselage';
import React, { useState, useContext } from 'react';
import styles from './ChatInput.module.css';
import { EmojiPicker } from '../EmojiPicker/index';
import Popup from 'reactjs-popup';
import RCContext from '../../context/RCInstance';
import he from 'he';
import { useUserStore } from '../../store';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { RCInstance } = useContext(RCContext);

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const sendMessage = async () => {
    if (!message.length || !isUserAuthenticated) {
      return;
    }
    await RCInstance.sendMessage(message);
    setMessage('');
  };

  const handleEmojiClick = (n) => {
    if (n.length > 5) {
      let flagUnifed = '&#x' + n.split('-').join(';&#x') + ';';
      let flag = he.decode(flagUnifed);
      setMessage(message + flag);
      return;
    }
    let unified_emoji = he.decode(`&#x${n};`);
    setMessage(message + unified_emoji);
  }
  const handleLogin = async () => {
    await RCInstance.googleSSOLogin(signIn);
    const { messages } = await RCInstance.getMessages();
    setMessages(messages);
    dispatchToastMessage({
      type: 'success',
      message: 'Successfully logged in',
    });
  };

  return (
    <Box>
      <Box m={2} className={styles.container} border={'2px solid #ddd'}>
        <Popup
          disabled={!isUserAuthenticated}
          trigger={<Icon name="emoji" size="x25" padding={6} />}
          position={'top left'}
        >
          <EmojiPicker handleEmojiClick={handleEmojiClick} />
        </Popup>
        <input
          placeholder={isUserAuthenticated ? 'Message' : 'Sign in to chat'}
          disabled={!isUserAuthenticated}
          value={message}
          className={styles.textInput}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (!message.length || !isUserAuthenticated) {
              return;
            }
            if (e.keyCode === 13) {
              sendMessage();
            }
          }}
        />
        <Icon
          disabled={!isUserAuthenticated}
          onClick={sendMessage}
          name="send"
          size="x25"
          padding={6}
        />
      </Box>
    </Box>
  );
};

export default ChatInput;
