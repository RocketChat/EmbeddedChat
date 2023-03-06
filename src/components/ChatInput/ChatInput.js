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
import useAttachmentWindowStore from '../../store/attachmentwindow';
import MembersList from '../Mentions/MembersList';
import mentionmemberStore from '../../store/mentionmemberStore';
import { searchToMentionUser } from '../../lib/searchToMentionUser';

const ChatInput = () => {
  const { RCInstance } = useContext(RCContext);
  const inputRef = useRef(null);
  const messageRef = useRef();
  const [disableButton, setDisableButton] = useState(true);

  const roomMembers = mentionmemberStore((state) => state.roomMembers);
  const setRoomMembers = mentionmemberStore((state) => state.setRoomMembers);

  const [filteredMembers, setFilteredMembers] = useState([]);

  const [mentionIndex, setmentionIndex] = useState(-1);
  const [startReading, setStartReading] = useState(false);
  const showMembersList = mentionmemberStore((state) => state.showMembersList);
  const setshowMembersList = mentionmemberStore(
    (state) => state.toggleShowMembers
  );
  const setIsLoginModalOpen = loginModalStore(
    (state) => state.setIsLoginModalOpen
  );

  const { editMessage, setEditMessage, isRecordingMessage } = useMessageStore(
    (state) => ({
      editMessage: state.editMessage,
      setEditMessage: state.setEditMessage,
      isRecordingMessage: state.isRecordingMessage,
    })
  );

  const toggle = useAttachmentWindowStore((state) => state.toggle);
  const setData = useAttachmentWindowStore((state) => state.setData);

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

  const sendAttachment = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    toggle();
    setData(event.target.files[0]);
  };
  const getAllChannelMembers = async () => {
    try {
      const channelMembers = await RCInstance.getChannelMembers();
      setRoomMembers(channelMembers.members);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (editMessage.msg) {
      messageRef.current.value = editMessage.msg;
    }
  }, [editMessage]);
  useEffect(() => {
    getAllChannelMembers();
  }, []);

  return (
    <Box m="x20" border="2px solid #ddd">
      {showMembersList ? (
        <MembersList
          mentionIndex={mentionIndex}
          filteredMembers={filteredMembers}
        />
      ) : (
        <></>
      )}
      <Box className={styles.container}>
        <textarea
          disabled={!isUserAuthenticated || isRecordingMessage}
          placeholder={isUserAuthenticated ? 'Message' : 'Sign in to chat'}
          className={styles.textInput}
          onChange={(e) => {
            messageRef.current.value = e.target.value;
            setDisableButton(!messageRef.current.value.length);

            e.target.style.height = 'auto';
            if (e.target.scrollHeight <= 150)
              e.target.style.height = `${e.target.scrollHeight - 10}px`;
            else e.target.style.height = '150px';

            searchToMentionUser(
              messageRef.current.value,
              roomMembers,
              startReading,
              setStartReading,
              setFilteredMembers,
              setmentionIndex,
              setshowMembersList
            );
          }}
          onKeyDown={(e) => {
            if (e.shiftKey && e.keyCode === 13) {
              // new line with shift enter. do nothing.
              return;
            }
            if (e.ctrlKey && e.keyCode === 13) {
              // Insert line break in text input field
              messageRef.current.value += '\n';
            } else if (editMessage.msg && e.keyCode === 27) {
              messageRef.current.value = '';
              setDisableButton(true);
              setEditMessage({});
            } else if (filteredMembers.length === 0 && e.keyCode === 13) {
              e.preventDefault();
              e.target.style.height = '38px';
              sendMessage();
            }

            if (e.key === 'ArrowDown') {
              setmentionIndex(
                mentionIndex + 1 >= filteredMembers.length + 2
                  ? 0
                  : mentionIndex + 1
              );
            }
            if (e.key === 'ArrowUp') {
              setmentionIndex(
                mentionIndex - 1 < 0
                  ? filteredMembers.length + 1
                  : mentionIndex - 1
              );
            }
            if (showMembersList && e.key === 'Enter') {
              e.preventDefault();
              let selectedMember = null;
              if (mentionIndex === filteredMembers.length)
                selectedMember = 'all';
              else if (mentionIndex === filteredMembers.length + 1)
                selectedMember = 'everyone';
              else selectedMember = filteredMembers[mentionIndex].username;
              messageRef.current.value = `${messageRef.current.value.substring(
                0,
                messageRef.current.value.lastIndexOf('@')
              )}@${selectedMember}`;

              setshowMembersList(false);

              setStartReading(false);
              setFilteredMembers([]);
              setmentionIndex(-1);
            }
          }}
          ref={messageRef}
        />

        <input type="file" hidden ref={inputRef} onChange={sendAttachment} />
        {isUserAuthenticated ? (
          <ActionButton
            bg="surface"
            border="0px"
            disabled={disableButton || isRecordingMessage}
          >
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
            primary
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
