import { Box, Button, Icon } from '@rocket.chat/fuselage';
import React, { useState, useContext } from 'react';
import styles from './ChatInput.module.css';
import { EmojiPicker } from '../EmojiPicker/index';
import Popup from 'reactjs-popup';
import RCContext from '../../context/RCInstance';
import he from 'he';
import { useGoogleLogin } from '../../hooks/useGoogleLogin';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const { RCInstance, cookies } = useContext(RCContext);
  const { signIn } = useGoogleLogin();

  const sendMessage = async () => {
    await RCInstance.sendMessage(message, cookies);
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
    const tokens = await signIn();
    const req = await fetch('http://localhost:3000/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceName: 'google',
        accessToken: tokens.access_token,
        idToken: tokens.id_token,
        expiresIn: 3600,
      }),
    });
    const response = await req.json();
    console.log(response);
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
        {/* <Icon onClick={sendMessage} name="send" size="x25" padding={6} /> */}
        <Button onClick={handleLogin}>Login</Button>
      </Box>
    </Box>
  );
};

export default ChatInput;
