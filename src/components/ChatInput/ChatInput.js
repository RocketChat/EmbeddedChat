import { Box, Button, Icon } from '@rocket.chat/fuselage';
import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import he from 'he';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import styles from './ChatInput.module.css';
import { EmojiPicker } from '../EmojiPicker/index';
import RCContext from '../../context/RCInstance';
import { useToastStore, useUserStore, useMessageStore } from '../../store';
import { useRCAuth4Google } from '../../hooks/useRCAuth4Google';

const ChatInput = ({ GOOGLE_CLIENT_ID }) => {
  const [message, setMessage] = useState('');
  const { RCInstance } = useContext(RCContext);
  const inputRef = useRef(null);
  const { handleLogin } = useRCAuth4Google();

  const { editMessage, setEditMessage } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
  }));

  const handleClickToOpenFiles = () => {
    inputRef.current.click();
  };

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  const toastPosition = useToastStore((state) => state.position);

  const dispatchToastMessage = useToastBarDispatch();

  const sendMessage = async () => {
    if (!message.length || !isUserAuthenticated) {
      if (editMessage.msg) {
        setEditMessage({});
      }
      return;
    }

    if (!editMessage.msg) {
      const res = await RCInstance.sendMessage(message);
      if (!res.success) {
        await RCInstance.logout();
        setIsUserAuthenticated(false);
        dispatchToastMessage({
          type: 'error',
          message: 'Error sending message, login again',
          position: toastPosition,
        });
      }
      setMessage('');
    } else {
      const res = await RCInstance.updateMessage(editMessage.id, message);
      if (!res.success) {
        await RCInstance.logout();
        setIsUserAuthenticated(false);
        dispatchToastMessage({
          type: 'error',
          message: 'Error editing message, login again',
          position: toastPosition,
        });
      }
      setMessage('');
      setEditMessage({});
    }
  };

  const handleEmojiClick = (n) => {
    if (n.length > 5) {
      const flagUnifed = `&#x${n.split('-').join(';&#x')};`;
      const flag = he.decode(flagUnifed);
      setMessage(message + flag);
      return;
    }
    const unified_emoji = he.decode(`&#x${n};`);
    setMessage(message + unified_emoji);
  };

  const sendAttachment = async (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    await RCInstance.sendAttachment(event.target);
  };

  useEffect(() => {
    if (editMessage.msg) {
      setMessage(editMessage.msg);
    }
  }, [editMessage]);

  return (
    <>
      <Box className={styles.container} border="2px solid #ddd">
        {isUserAuthenticated && (
          <Popup
            disabled={!isUserAuthenticated}
            trigger={<Icon name="emoji" size="x25" padding={6} />}
            position="top left"
          >
            <EmojiPicker handleEmojiClick={handleEmojiClick} />
          </Popup>
        )}
        <input
          placeholder={isUserAuthenticated ? 'Message' : 'Sign in to chat'}
          disabled={!isUserAuthenticated}
          value={message}
          className={styles.textInput}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={(e) => {
            if (editMessage.msg && e.keyCode === 27) {
              setMessage('');
              setEditMessage({});
            } else if (e.keyCode === 13) {
              sendMessage();
            }
          }}
        />
        <input type="file" hidden ref={inputRef} onChange={sendAttachment} />
        {isUserAuthenticated ? (
          message ? (
            <Icon
              disabled={!isUserAuthenticated}
              onClick={sendMessage}
              name="send"
              size="x25"
              padding={6}
            />
          ) : (
            <Icon
              disabled={!isUserAuthenticated}
              onClick={handleClickToOpenFiles}
              name="plus"
              size="x25"
              padding={6}
            />
          )
        ) : (
          <>
            <Button onClick={handleLogin} style={{ overflow: 'visible' }}>
              <Icon name="google" size="x20" padding="0px 5px 0px 0px" />
              Sign In with Google
            </Button>
          </>
        )}
      </Box>
    </>
  );
};

export default ChatInput;

ChatInput.propTypes = {
  GOOGLE_CLIENT_ID: PropTypes.string,
};
