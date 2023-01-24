import { Box, Button, Icon } from '@rocket.chat/fuselage';
import React, { useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import styles from './ChatInput.module.css';
import RCContext from '../../context/RCInstance';
import { useGoogleLogin } from '../../hooks/useGoogleLogin';
import { useToastStore, useUserStore, useMessageStore } from '../../store';
import ChatInputFormattingToolbar from './ChatInputFormattingToolbar';

const ChatInput = ({ GOOGLE_CLIENT_ID }) => {
  const { signIn } = useGoogleLogin(GOOGLE_CLIENT_ID);
  const { RCInstance } = useContext(RCContext);
  const inputRef = useRef(null);
  const messageRef = useRef();

  const { editMessage, setEditMessage } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
  }));

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  const setUserAvatarUrl = useUserStore((state) => state.setUserAvatarUrl);
  const toastPosition = useToastStore((state) => state.position);
  const setAuthenticatedUserUsername = useUserStore(
    (state) => state.setUsername
  );

  const dispatchToastMessage = useToastBarDispatch();

  const sendMessage = async () => {
    const message = messageRef.current.value;
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
      messageRef.current.value = '';
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
      messageRef.current.value = '';
      setEditMessage({});
    }
  };

  const handleLogin = async () => {
    const res = await RCInstance.googleSSOLogin(signIn);
    if (res.status === 'success') {
      setUserAvatarUrl(res.me.avatarUrl);
      setAuthenticatedUserUsername(res.me.username);
      setIsUserAuthenticated(true);
      dispatchToastMessage({
        type: 'success',
        message: 'Successfully logged in',
        position: toastPosition,
      });
    } else {
      dispatchToastMessage({
        type: 'error',
        message: 'Something wrong happened',
        position: toastPosition,
      });
    }
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
      messageRef.current.value = editMessage.msg;
    }
  }, [editMessage]);

  return (
    <Box m="x20" border="2px solid #ddd">
      <Box className={styles.container}>
        <input
          placeholder={isUserAuthenticated ? 'Message' : 'Sign in to chat'}
          disabled={!isUserAuthenticated}
          className={styles.textInput}
          onChange={(e) => {
            messageRef.current.value = e.target.value;
          }}
          onKeyDown={(e) => {
            if (editMessage.msg && e.keyCode === 27) {
              messageRef.current.value = '';
              setEditMessage({});
            } else if (e.keyCode === 13) {
              sendMessage();
            }
          }}
          ref={messageRef}
        />
        <input type="file" hidden ref={inputRef} onChange={sendAttachment} />
        {isUserAuthenticated ? (
          <Icon
            className={styles.chatInputIconCursor}
            disabled={!isUserAuthenticated}
            onClick={sendMessage}
            name="send"
            size="x25"
            padding={6}
          />
        ) : (
          <Button onClick={handleLogin} style={{ overflow: 'visible' }}>
            <Icon name="google" size="x20" padding="0px 5px 0px 0px" />
            Sign In with Google
          </Button>
        )}
      </Box>
      <ChatInputFormattingToolbar messageRef={messageRef} inputRef={inputRef} />
    </Box>
  );
};

export default ChatInput;

ChatInput.propTypes = {
  GOOGLE_CLIENT_ID: PropTypes.string,
};
