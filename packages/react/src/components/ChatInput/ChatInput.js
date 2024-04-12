import React, { useState, useRef, useEffect, useCallback } from 'react';
import { css } from '@emotion/react';
import styles from './ChatInput.module.css';
import { useRCContext } from '../../context/RCInstance';
import {
  useToastStore,
  useUserStore,
  useMessageStore,
  loginModalStore,
  useChannelStore,
  useMemberStore,
} from '../../store';
import ChatInputFormattingToolbar from './ChatInputFormattingToolbar';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import MembersList from '../Mentions/MembersList';
import { searchToMentionUser } from '../../lib/searchToMentionUser';
import TypingUsers from '../TypingUsers';
import createPendingMessage from '../../lib/createPendingMessage';
import { parseEmoji } from '../../lib/emoji';
import { Button } from '../Button';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { CommandsList } from '../CommandList';
import { ActionButton } from '../ActionButton';
import { Divider } from '../Divider';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import { Modal } from '../Modal';
import useSettingsStore from '../../store/settingsStore';

const editingMessageCss = css`
  background-color: #fff8e0;
  & textarea {
    background-color: inherit;
  }
`;

const ChatInput = ({ scrollToBottom }) => {
  const { styleOverrides, classNames } = useComponentOverrides('ChatInput');
  const { RCInstance, ECOptions } = useRCContext();
  const [commands, setCommands] = useState([]);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const canSendMsg = useUserStore((state) => state.canSendMsg);

  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);

  const members = useMemberStore((state) => state.members);
  const setMembersHandler = useMemberStore((state) => state.setMembersHandler);
  const msgMaxLength = useSettingsStore((state) => state.messageLimit);

  useEffect(() => {
    RCInstance.auth.onAuthChange((user) => {
      if (user) {
        RCInstance.getCommandsList()
          .then((data) => setCommands(data.commands || []))
          .catch(console.error);

        RCInstance.getChannelMembers(isChannelPrivate)
          .then((channelMembers) =>
            setMembersHandler(channelMembers.members || [])
          )
          .catch(console.error);
      }
    });
  }, [RCInstance]);

  const [filteredCommands, setFilteredCommands] = useState([]);
  const getFilteredCommands = useCallback(
    (cmd) => commands.filter((c) => c.command.startsWith(cmd.replace('/', ''))),
    [commands]
  );

  const execCommand = async (command, params) => {
    await RCInstance.execCommand({ command, params });
    setFilteredCommands([]);
  };

  const inputRef = useRef(null);
  const typingRef = useRef();
  const messageRef = useRef(null);

  const [disableButton, setDisableButton] = useState(true);

  const [filteredMembers, setFilteredMembers] = useState([]);

  const [mentionIndex, setmentionIndex] = useState(-1);
  const [startReading, setStartReading] = useState(false);
  const [showMembersList, setshowMembersList] = useState(false);

  const setIsLoginModalOpen = loginModalStore(
    (state) => state.setIsLoginModalOpen
  );

  const [isMsgLong, setIsMsgLong] = useState(false);

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
  const openMsgLongModal = () => {
    setIsMsgLong(true);
  };
  const closeMsgLongModal = () => {
    setIsMsgLong(false);
  };

  const onJoin = async () => {
    if (!isUserAuthenticated) {
      if (ECOptions.authFlow === 'OAUTH') {
        try {
          await RCInstance.auth.loginWithRocketChatOAuth();
        } catch (e) {
          console.error(e);
          dispatchToastMessage({
            type: 'error',
            message: e.message,
          });
        }
      } else {
        openLoginModal();
      }
    }
  };

  const sendMessage = async (isAttachmentMode = false) => {
    messageRef.current.focus();
    messageRef.current.style.height = '44px';
    const message = messageRef.current.value.trim();

    if (isAttachmentMode) {
      const messageBlob = new Blob([message], { type: 'text/plain' });
      const file = new File([messageBlob], 'message.txt', {
        type: 'text/plain',
        lastModified: Date.now(),
      });

      toggle();
      setData(file);

      messageRef.current.value = '';
      setEditMessage({});
      return;
    }
    if (message.length > msgMaxLength) {
      openMsgLongModal();
      return;
    }

    if (!message.length || !isUserAuthenticated) {
      messageRef.current.value = '';
      if (editMessage.msg) {
        setEditMessage({});
      }
      return;
    }

    if (!editMessage.msg) {
      if (message.startsWith('/')) {
        const [command, ...paramsArray] = message.split(' ');
        const params = paramsArray.join(' ');

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
        });
      } else {
        replaceMessage(pendingMessage._id, res.message);
      }
      setDisableButton(true);
    } else {
      const res = await RCInstance.updateMessage(
        editMessage._id,
        message.replace(/\n/g, '\\n')
      );
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

    scrollToBottom();
  };

  const handleConvertToAttachment = () => {
    closeMsgLongModal();
    sendMessage(true);
  };

  const sendAttachment = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    toggle();
    setData(event.target.files[0]);
  };

  useEffect(() => {
    if (editMessage.msg) {
      messageRef.current.value = editMessage.msg;
    } else {
      messageRef.current.value = '';
    }
  }, [editMessage]);

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

  const handleMemberClick = (selectedItem) => {
    setshowMembersList(false);

    let insertionText;
    if (selectedItem === 'all') {
      insertionText = `${messageRef.current.value.substring(
        0,
        messageRef.current.value.lastIndexOf('@')
      )}@all `;
    } else if (selectedItem === 'here') {
      insertionText = `${messageRef.current.value.substring(
        0,
        messageRef.current.value.lastIndexOf('@')
      )}@here `;
    } else {
      insertionText = `${messageRef.current.value.substring(
        0,
        messageRef.current.value.lastIndexOf('@')
      )}@${selectedItem.username} `;
    }

    messageRef.current.value = insertionText;

    const cursorPosition = insertionText.length;
    messageRef.current.setSelectionRange(cursorPosition, cursorPosition);
    messageRef.current.focus();
  };

  const showCommands = useCallback(
    async (e) => {
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
    },
    [getFilteredCommands]
  );

  const onTextChange = (e) => {
    messageRef.current.value = parseEmoji(e.target.value);

    if (e.code === 'Enter') {
      messageRef.current.value += '\n';
      sendTypingStop();
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
      members,
      startReading,
      setStartReading,
      setFilteredMembers,
      setmentionIndex,
      setshowMembersList
    );
    sendTypingStart();
  };

  const onKeyDown = (e) => {
    if (e.shiftKey && e.keyCode === 13) {
      // new line with shift enter. do nothing.
      return;
    }
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      if (end - start > 0) {
        const italic = ` _${messageRef.current.value.slice(start, end)}_ `;
        messageRef.current.value =
          messageRef.current.value.slice(0, start) +
          italic +
          messageRef.current.value.slice(end);
      } else {
        messageRef.current.value = '__';
        e.target.setSelectionRange(start + 1, start + 1);
      }
    }
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      if (end - start > 0) {
        const bold = ` *${messageRef.current.value.slice(start, end)}* `;
        messageRef.current.value =
          messageRef.current.value.slice(0, start) +
          bold +
          messageRef.current.value.slice(end);
      } else {
        messageRef.current.value = '**';
        e.target.setSelectionRange(start + 1, start + 1);
      }
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
      e.preventDefault();
      setmentionIndex(
        mentionIndex + 1 >= filteredMembers.length + 2 ? 0 : mentionIndex + 1
      );
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setmentionIndex(
        mentionIndex - 1 < 0 ? filteredMembers.length + 1 : mentionIndex - 1
      );

      const lastIndexOfAt = messageRef.current.value.lastIndexOf('@');
      const cursorPosition = lastIndexOfAt === -1 ? 0 : lastIndexOfAt + 1;
      messageRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (showMembersList) {
        let selectedMember = null;
        if (mentionIndex === filteredMembers.length) selectedMember = 'all';
        else if (mentionIndex === filteredMembers.length + 1)
          selectedMember = 'here';
        else selectedMember = filteredMembers[mentionIndex].username;

        handleMemberClick(selectedMember);

        setshowMembersList(false);
        setStartReading(false);
        setFilteredMembers([]);
        setmentionIndex(-1);
      } else {
        sendTypingStop();
        sendMessage();
      }
    }
  };
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
          <>
            <MembersList
              mentionIndex={mentionIndex}
              filteredMembers={filteredMembers}
              onMemberClick={handleMemberClick}
            />
            <Divider />
          </>
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
          css={[
            css`
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: row;
            `,
            editMessage.msg && editingMessageCss,
          ]}
        >
          <textarea
            rows={1}
            disabled={!isUserAuthenticated || !canSendMsg || isRecordingMessage}
            placeholder={
              isUserAuthenticated && canSendMsg
                ? 'Message'
                : isUserAuthenticated
                ? 'This room is read only'
                : 'Sign in to chat'
            }
            className={styles.textInput}
            onChange={onTextChange}
            onKeyUp={showCommands}
            onBlur={sendTypingStop}
            onKeyDown={onKeyDown}
            ref={messageRef}
          />

          <input type="file" hidden ref={inputRef} onChange={sendAttachment} />
          <Box>
            {isUserAuthenticated ? (
              <ActionButton
                ghost
                size="medium"
                onClick={() => sendMessage()}
                disabled={disableButton || isRecordingMessage}
              >
                <Icon className={styles.chatInputIconCursor} name="send" />
              </ActionButton>
            ) : (
              <Button onClick={onJoin} color="primary">
                JOIN
              </Button>
            )}
          </Box>
        </Box>
        {isUserAuthenticated && (
          <ChatInputFormattingToolbar
            messageRef={messageRef}
            inputRef={inputRef}
          />
        )}
      </Box>
      {isMsgLong && (
        <Modal>
          <Modal
            css={css`
              padding: 1em;
            `}
            onClose={closeMsgLongModal}
          >
            <Modal.Header>
              <Modal.Title>
                <Icon name="report" size="1.25rem" />
                Message Too Long!
              </Modal.Title>
              <Modal.Close onClick={closeMsgLongModal} />
            </Modal.Header>
            <Modal.Content
              css={css`
                margin: 1em;
              `}
            >
              {' '}
              Send it as attachment instead?{' '}
            </Modal.Content>
            <Modal.Footer>
              <Button color="secondary" onClick={closeMsgLongModal}>
                Cancel
              </Button>
              <Button onClick={handleConvertToAttachment} color="primary">
                Ok
              </Button>
            </Modal.Footer>
          </Modal>
        </Modal>
      )}
    </Box>
  );
};

export default ChatInput;
