import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import { css } from '@emotion/react';
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
import TypingUsers from '../TypingUsers';
import createPendingMessage from '../../lib/createPendingMessage';
import { parseEmoji } from '../../lib/emoji';
import { Button } from '../Button';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { CommandsList } from '../CommandList';
import { ActionButton } from '../ActionButton';
import useComponentOverrides from '../../theme/useComponentOverrides';

const ChatInput = () => {
  const { styleOverrides, classNames } = useComponentOverrides('ChatInput');
  const { RCInstance, ECOptions } = useContext(RCContext);
  const [commands, setCommands] = useState([]);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  useEffect(() => {
    RCInstance.auth.onAuthChange((user) => {
      if (user) {
        RCInstance.getCommandsList()
          .then((data) => setCommands(data.commands || []))
          .catch(console.error);
      }
    });
  }, [RCInstance]);

  const [filteredCommands, setFilteredCommands] = useState([]);
  const getFilteredCommands = (cmd) =>
    commands.filter((c) => c.command.startsWith(cmd.replace('/', '')));

  const execCommand = async (command, params) => {
    await RCInstance.execCommand({ command, params });
    setFilteredCommands([]);
  };

  const inputRef = useRef(null);
  const typingRef = useRef();
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

  const {
    editMessage,
    setEditMessage,
    isRecordingMessage,
    upsertMessage,
    replaceMessage,
    threadId,
  } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
    isRecordingMessage: state.isRecordingMessage,
    upsertMessage: state.upsertMessage,
    replaceMessage: state.replaceMessage,
    threadId: state.threadMainMessage?._id,
  }));

  const toggle = useAttachmentWindowStore((state) => state.toggle);
  const setData = useAttachmentWindowStore((state) => state.setData);

  const user = useUserStore((state) => ({
    _id: state.userId,
    username: state.username,
    name: state.name,
  }));

  const toastPosition = useToastStore((state) => state.position);

  const dispatchToastMessage = useToastBarDispatch();

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const sendMessage = async () => {
    messageRef.current.style.height = '44px';
    const message = messageRef.current.value.trim();
    if (!message.length || !isUserAuthenticated) {
      messageRef.current.value = '';
      if (editMessage.msg) {
        setEditMessage({});
      }
      return;
    }

    if (!editMessage.msg) {
      if (message.startsWith('/')) {
        // its a slash command
        const [command, params] = message.split(/\s+/);
        if (commands.find((c) => c.command === command.replace('/', ''))) {
          messageRef.current.value = '';
          setDisableButton(true);
          setEditMessage({});
          await execCommand(command.replace('/', ''), params);
          return;
        }
      }

      messageRef.current.value = '';
      const pendingMessage = createPendingMessage(message, user);
      if (ECOptions.enableThreads && threadId) {
        pendingMessage.tmid = threadId;
      }
      upsertMessage(pendingMessage, ECOptions.enableThreads);
      const res = await RCInstance.sendMessage(
        {
          msg: pendingMessage.msg,
          _id: pendingMessage._id,
        },
        ECOptions.enableThreads ? threadId : undefined
      );

      if (!res.success) {
        await RCInstance.logout();
        setIsUserAuthenticated(false);
        dispatchToastMessage({
          type: 'error',
          message: 'Error sending message, login again',
          position: toastPosition,
        });
      } else {
        replaceMessage(pendingMessage._id, res.message);
      }
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

  const username = useUserStore((state) => state.username);
  const timerRef = useRef();
  const sendTypingStart = async () => {
    try {
      if (typingRef.current && messageRef.current.value?.length) {
        // 15 seconds has not been passed since last send.
        return;
      }
      if (messageRef.current.value?.length) {
        typingRef.current = true;
        timerRef.current = setTimeout(() => {
          typingRef.current = false;
        }, [15000]);
        await RCInstance.sendTypingStatus(username, true);
      } else {
        clearTimeout(timerRef.current);
        typingRef.current = false;
        await RCInstance.sendTypingStatus(username, false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendTypingStop = async () => {
    try {
      typingRef.current = false;
      await RCInstance.sendTypingStatus(username, false);
    } catch (e) {
      console.error(e);
    }
  };

  const onCommandClick = useCallback(async (command) => {
    const commandName = command.command;
    const currentMessage = messageRef.current.value;
    const tokens = (currentMessage || '').split(' ');
    const firstTokenIdx = tokens.findIndex((token) => token.match(/^\/\w*$/));
    if (firstTokenIdx !== -1) {
      tokens[firstTokenIdx] = `/${commandName}`;
      const newMessageString = tokens.join(' ');
      messageRef.current.value = newMessageString;
      setFilteredCommands([]);
    }
  }, []);

  const showCommands = useCallback(async (e) => {
    const cursor = e.target.selectionStart;
    const tokens = e.target.value
      .trim()
      .slice(0, cursor + 1)
      .split(/\s+/);
    if (tokens.length === 1 && tokens[0].startsWith('/')) {
      setFilteredCommands(getFilteredCommands(tokens[0]));
    } else {
      setFilteredCommands([]);
    }
  });

  return (
    <Box className={`ec-chat-input ${classNames}`} style={styleOverrides}>
      <Box
        css={css`
          margin-inline-start: 20px;
        `}
      >
        <TypingUsers />
      </Box>
      <Box
        css={css`
          margin-top: 20px;
          border: 2px solid #ddd;
        `}
      >
        {showMembersList ? (
          <MembersList
            mentionIndex={mentionIndex}
            filteredMembers={filteredMembers}
          />
        ) : (
          <></>
        )}
        {filteredCommands.length === 0 ? null : (
          <CommandsList
            filteredCommands={filteredCommands}
            onCommandClick={onCommandClick}
          />
        )}
        <Box
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fff;
            flex-direction: row;
          `}
        >
          <textarea
            rows={1}
            disabled={!isUserAuthenticated || isRecordingMessage}
            placeholder={isUserAuthenticated ? 'Message' : 'Sign in to chat'}
            className={styles.textInput}
            onChange={(e) => {
              messageRef.current.value = parseEmoji(e.target.value);

              if (e.code === 'Enter') {
                messageRef.current.value += '\n';
              }

              setDisableButton(!messageRef.current.value.length);

              e.target.style.height = 'auto';
              if (e.target.scrollHeight <= 150) {
                e.target.style.boxSizing = 'border-box';
                e.target.style.height = `${e.target.scrollHeight}px`;
              } else {
                e.target.style.height = '150px';
              }
              searchToMentionUser(
                messageRef.current.value,
                roomMembers,
                startReading,
                setStartReading,
                setFilteredMembers,
                setmentionIndex,
                setshowMembersList
              );
              sendTypingStart();
            }}
            onKeyUp={showCommands}
            onBlur={sendTypingStop}
            onKeyDown={(e) => {
              if (e.shiftKey && e.keyCode === 13) {
                // new line with shift enter. do nothing.
                return;
              }
              if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
                // Insert line break in text input field
                messageRef.current.value += '\n';
                e.target.style.height = 'auto';
                if (e.target.scrollHeight <= 150) {
                  e.target.style.boxSizing = 'border-box';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                } else {
                  e.target.style.height = '150px';
                }
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
              ghost
              size="medium"
              onClick={sendMessage}
              disabled={disableButton || isRecordingMessage}
              style={{ padding: '0.5rem' }}
            >
              <Icon
                className={styles.chatInputIconCursor}
                name="send"
                size="1.25rem"
              />
            </ActionButton>
          ) : (
            <Button
              onClick={openLoginModal}
              color="primary"
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
    </Box>
  );
};

export default ChatInput;
