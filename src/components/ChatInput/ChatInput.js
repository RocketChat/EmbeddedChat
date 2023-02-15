import { Box, Button, Icon, ActionButton } from '@rocket.chat/fuselage';
import React, { useState, useContext, useRef, useEffect } from 'react';
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
  const [disableButton, setDisableButton] = useState(true);
  const [members, setMembers] = useState({});
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [mentionIndex, setmentionIndex] = useState(-1);
  const [startReading, setStartReading] = useState(false);
  const [showMembersList, setshowMembersList] = useState(false);

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
  const getAllChannelMembers = async () => {
    const channelMembers = await RCInstance.getChannelMembers();
    setMembers(channelMembers.members);
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
        <div style={{ display: 'block' }}>
          <ul style={{ listStyle: 'none' }}>
            {filteredMembers.map((member, index) => (
              <li
                key={member._id}
                style={{
                  backgroundColor: index === mentionIndex ? '#ddd' : 'white',
                }}
              >
                {member.name} @{member.username}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <></>
      )}
      <Box className={styles.container}>
        <textarea
          placeholder={isUserAuthenticated ? 'Message' : 'Sign in to chat'}
          disabled={!isUserAuthenticated}
          className={styles.textInput}
          onChange={(e) => {
            messageRef.current.value = e.target.value;
            setDisableButton(!messageRef.current.value.length);

            e.target.style.height = 'auto';
            if (e.target.scrollHeight <= 150)
              e.target.style.height = `${e.target.scrollHeight - 10}px`;
            else e.target.style.height = '129px';

            let message = messageRef.current.value;
            if (message.length === 0) return;
            let lastChar = message[message.length - 1];

            if (lastChar === '@') {
              setStartReading(true);
              setFilteredMembers(members);
              setmentionIndex(0);
              setshowMembersList(true);
            } else {
              if (startReading) {
                if (lastChar === ' ') {
                  setStartReading(false);
                  setFilteredMembers([]);
                  setmentionIndex(-1);
                  setshowMembersList(false);
                } else {
                  let c = message.lastIndexOf('@');

                  setFilteredMembers(
                    members.filter(
                      (member) =>
                        member.name
                          .toLowerCase()
                          .includes(message.substring(c + 1).toLowerCase()) ||
                        member.username
                          .toLowerCase()
                          .includes(message.substring(c + 1).toLowerCase())
                    )
                  );

                  setshowMembersList(true);
                  setmentionIndex(0);
                }
              }
            }
          }}
          onKeyDown={(e) => {
            if (editMessage.msg && e.keyCode === 27) {
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
                mentionIndex + 1 >= filteredMembers.length
                  ? 0
                  : mentionIndex + 1
              );
            }
            if (e.key === 'ArrowUp') {
              setmentionIndex(
                mentionIndex - 1 < 0
                  ? filteredMembers.length - 1
                  : mentionIndex - 1
              );
            }
            if (filteredMembers.length > 0 && e.key === 'Enter') {
              e.preventDefault();
              const selectedMember = filteredMembers[mentionIndex];
              messageRef.current.value =
                messageRef.current.value.substring(
                  0,
                  messageRef.current.value.lastIndexOf('@')
                ) +
                '@' +
                selectedMember.username;

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
          <Button onClick={handleLogin} style={{ overflow: 'visible' }}>
            <Icon name="google" size="x20" padding="0px 5px 0px 0px" />
            Sign In with Google
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

ChatInput.propTypes = {
  GOOGLE_CLIENT_ID: PropTypes.string,
};
