import { Box, Button, Icon, ActionButton } from '@rocket.chat/fuselage';
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import styles from './ChatInput.module.css';
import RCContext from '../../context/RCInstance';
import {
  useToastStore,
  useUserStore,
  useMessageStore,
  loginModalStore,
} from '../../store';
import ChatInputFormattingToolbar from './ChatInputFormattingToolbar';

const ChatInput = () => {
  const { RCInstance } = useContext(RCContext);
  const inputRef = useRef(null);
  const messageRef = useRef();
  const [disableButton, setDisableButton] = useState(true);
  const setIsLoginModalOpen = loginModalStore(
    (state) => state.setIsLoginModalOpen
  );

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

  const toastPosition = useToastStore((state) => state.position);

  const dispatchToastMessage = useToastBarDispatch();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const sendMessage = async () => {
    messageRef.current.style.height = '38px';
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
      setDisableButton(true);
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
      setDisableButton(true);
      setEditMessage({});
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
        <textarea
          placeholder={isUserAuthenticated ? 'Message' : 'Sign in to chat'}
          disabled={!isUserAuthenticated}
          className={styles.textInput}
          onChange={(e) => {
            messageRef.current.value = e.target.value;
            setDisableButton(!messageRef.current.value.length);
            e.target.style.height = 'auto';
            if (e.target.scrollHeight <= 150) {
              e.target.style.height = `${e.target.scrollHeight}px`;
            } else {
              e.target.style.height = '150px';
            }
          }}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.keyCode === 13) {
              // Insert line break in text input field
              messageRef.current.value += '\n';
            } else if (editMessage.msg && e.keyCode === 27) {
              messageRef.current.value = '';
              setDisableButton(true);
              setEditMessage({});
            } else if (e.keyCode === 13) {
              e.target.style.height = '38px';
              sendMessage();
            }
          }}
          ref={messageRef}
        />
        <input type="file" hidden ref={inputRef} onChange={sendAttachment} />
        {isUserAuthenticated ? (
          <ActionButton bg="surface" border="0px" disabled={disableButton}>
            <Icon
              className={styles.chatInputIconCursor}
              onClick={sendMessage}
              name="send"
              size="x25"
              padding={6}
            />
          </ActionButton>
        ) : (
          <Button
            onClick={openLoginModal}
            backgroundColor="blue"
            color="white"
            style={{ overflow: 'visible' }}
          >
            JOIN
          </Button>
        )}
      </Box>
      {isUserAuthenticated && (
        <ChatInputFormattingToolbar
          messageRef={messageRef}
          inputRef={inputRef}
        />
      )}
    </Box>
  );
};

export default ChatInput;
