import { Box, Button, Icon } from '@rocket.chat/fuselage';
import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styles from './ChatInput.module.css';
import { EmojiPicker } from '../EmojiPicker/index';
import Popup from 'reactjs-popup';
import RCContext from '../../context/RCInstance';
import he from 'he';
import { useGoogleLogin } from '../../hooks/useGoogleLogin';

const ChatInput = ({ GOOGLE_CLIENT_ID }) => {
  const [message, setMessage] = useState('');
  const { RCInstance } = useContext(RCContext);
  const { signIn } = useGoogleLogin(GOOGLE_CLIENT_ID);

  const sendMessage = async () => {
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
    const cookies = await RCInstance.googleSSOLogin(signIn);
    RCInstance.setCookies(cookies);
  };

  return (
    <Box>
      <Box m={2} className={styles.container} border={'2px solid #ddd'}>
        <Popup
          trigger={<Icon name="emoji" size="x25" padding={6} />}
          position={'top left'}
        >
          <EmojiPicker handleEmojiClick={handleEmojiClick} />
        </Popup>
        <input
          placeholder="Message"
          value={message}
          className={styles.textInput}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              sendMessage();
            }
          }}
        />
        {RCInstance.getCookies().rc_token ? (
          <Icon onClick={sendMessage} name="send" size="x25" padding={6} />
        ) : (
          <Button onClick={handleLogin}>Login</Button>
        )}
      </Box>
    </Box>
  );
};

export default ChatInput;

ChatInput.propTypes = {
  GOOGLE_CLIENT_ID: PropTypes.string,
};
