import React, { useState, useRef, useEffect, useCallback } from 'react';
import { css } from '@emotion/react';
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
import { TypingUsers } from '../TypingUsers';
import createPendingMessage from '../../lib/createPendingMessage';
import { parseEmoji } from '../../lib/emoji';
import { Button } from '../../components/Button';
import { Box } from '../../components/Box';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import { CommandsList } from '../CommandList';
import { ActionButton } from '../../components/ActionButton';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import { Modal } from '../../components/Modal';
import useSettingsStore from '../../store/settingsStore';
import ChannelState from '../ChannelState/ChannelState';
import QuoteMessage from '../QuoteMessage/QuoteMessage';
import { useChatInputStyles } from './ChatInput.styles';
import useFormatSelection from '../../hooks/useFormatSelection';

const ChatInput = ({ scrollToBottom }) => {
  const { styleOverrides, classNames } = useComponentOverrides('ChatInput');
  const { RCInstance, ECOptions } = useRCContext();
  const styles = useChatInputStyles();
  const [commands, setCommands] = useState([]);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const canSendMsg = useUserStore((state) => state.canSendMsg);

  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);
  const isChannelReadOnly = useChannelStore((state) => state.isChannelReadOnly);
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
  const chatInputContainer = useRef(null);

  const [disableButton, setDisableButton] = useState(true);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [mentionIndex, setmentionIndex] = useState(-1);
  const [commandIndex, setCommandIndex] = useState(0);
  const [startReadMentionUser, setStartReadMentionUser] = useState(false);
  const [showMembersList, setshowMembersList] = useState(false);
  const [showCommandList, setShowCommandList] = useState(false);

  const { formatSelection } = useFormatSelection(messageRef);

  const setIsLoginModalOpen = loginModalStore(
    (state) => state.setIsLoginModalOpen
  );

  const [isMsgLong, setIsMsgLong] = useState(false);

  const {
    editMessage,
    setEditMessage,
    quoteMessage,
    setQuoteMessage,
    isRecordingMessage,
    upsertMessage,
    replaceMessage,
    threadId,
  } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
    quoteMessage: state.quoteMessage,
    setQuoteMessage: state.setQuoteMessage,
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

  const getMessageLink = async (id) => {
    const host = RCInstance.getHost();
    const res = await RCInstance.channelInfo();
    return `${host}/channel/${res.room.name}/?msg=${id}`;
  };

  const sendMessage = async () => {
    messageRef.current.focus();
    messageRef.current.style.height = '44px';
    const message = messageRef.current.value.trim();

    if (message.length > msgMaxLength) {
      openMsgLongModal();
      return;
    }

    if (!message.length || !isUserAuthenticated) {
      messageRef.current.value = '';
      if (editMessage.msg || editMessage.attachments) {
        setEditMessage({});
      }
      return;
    }

    if (!editMessage.msg && !editMessage.attachments) {
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
      let pendingMessage = '';
      if (quoteMessage.msg || quoteMessage.attachments) {
        const msgLink = await getMessageLink(quoteMessage?._id);
        pendingMessage = createPendingMessage(
          `[ ](${msgLink})\n ${message}`,
          user
        );
        setQuoteMessage({});
      } else {
        pendingMessage = createPendingMessage(message, user);
      }

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

  const handleAttachmentConversion = () => {
    closeMsgLongModal();
    const message = messageRef.current.value.trim();
    const messageBlob = new Blob([message], { type: 'text/plain' });
    const file = new File([messageBlob], 'message.txt', {
      type: 'text/plain',
      lastModified: Date.now(),
    });

    toggle();
    setData(file);

    messageRef.current.value = '';
    setEditMessage({});
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
    if (editMessage.attachments) {
      messageRef.current.value =
        editMessage.attachments[0]?.description || editMessage.msg;
    } else if (editMessage.msg) {
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

  const handleCommandClick = useCallback(async (command) => {
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
        setShowCommandList(true);
      } else {
        setFilteredCommands([]);
        setShowCommandList(false);
      }
    },
    [getFilteredCommands]
  );

  const handleNewLine = (e, addLine = true) => {
    if (addLine) messageRef.current.value += '\n';

    e.target.style.height = 'auto';
    if (e.target.scrollHeight <= 150) {
      e.target.style.boxSizing = 'border-box';
      e.target.style.height = `${e.target.scrollHeight}px`;
    } else {
      e.target.style.height = '150px';
    }
  };

  const onTextChange = (e) => {
    sendTypingStart();
    messageRef.current.value = parseEmoji(e.target.value);
    setDisableButton(!messageRef.current.value.length);

    handleNewLine(e, false);
    searchToMentionUser(
      messageRef.current.value,
      members,
      startReadMentionUser,
      setStartReadMentionUser,
      setFilteredMembers,
      setmentionIndex,
      setshowMembersList
    );
    showCommands(e);
  };

  const onKeyDown = (e) => {
    const handleArrowDown = () => {
      if (showMembersList) {
        e.preventDefault();
        setmentionIndex(
          mentionIndex + 1 >= filteredMembers.length + 2 ? 0 : mentionIndex + 1
        );
      }

      if (showCommandList) {
        e.preventDefault();
        setCommandIndex(
          commandIndex + 1 >= filteredCommands.length ? 0 : commandIndex + 1
        );
      }
    };

    const handleArrowUp = () => {
      if (showMembersList) {
        e.preventDefault();
        setmentionIndex(
          mentionIndex - 1 < 0 ? filteredMembers.length + 1 : mentionIndex - 1
        );
      }
      if (showCommandList) {
        e.preventDefault();
        setCommandIndex(
          commandIndex - 1 < 0 ? filteredCommands.length - 1 : commandIndex - 1
        );
      }
    };

    const handleEnter = () => {
      if (showMembersList) {
        setshowMembersList(false);
        setStartReadMentionUser(false);
        setFilteredMembers([]);
        setmentionIndex(-1);
      } else if (showCommandList) {
        setCommandIndex(0);
        setShowCommandList(false);
        setFilteredCommands([]);
      } else {
        sendTypingStop();
        sendMessage();
      }
    };

    switch (true) {
      case e.ctrlKey && e.code === 'KeyI': {
        e.preventDefault();
        formatSelection('_{{text}}_');
        break;
      }
      case e.ctrlKey && e.code === 'KeyB': {
        e.preventDefault();
        formatSelection('*{{text}}*');
        break;
      }
      case (e.ctrlKey || e.metaKey || e.shiftKey) && e.code === 'Enter':
        e.preventDefault();
        handleNewLine(e);
        break;
      case e.code === 'Escape':
        e.preventDefault();
        if (editMessage.msg || editMessage.attachments) {
          messageRef.current.value = '';
          setDisableButton(true);
          setEditMessage({});
        }
        break;

      case e.code === 'ArrowDown':
        handleArrowDown();
        break;
      case e.code === 'ArrowUp':
        handleArrowUp();
        break;
      case e.code === 'Enter':
        e.preventDefault();
        handleEnter();
        break;
      default:
        break;
    }
  };

  const handleFocus = () => {
    if (chatInputContainer.current) {
      chatInputContainer.current.classList.add('focused');
    }
  };

  const handleBlur = () => {
    if (chatInputContainer.current) {
      chatInputContainer.current.classList.remove('focused');
    }
  };

  return (
    <Box className={`ec-chat-input ${classNames}`} style={styleOverrides}>
      <Box>
        {(quoteMessage.msg || quoteMessage.attachments) && (
          <QuoteMessage message={quoteMessage} />
        )}
        {editMessage.msg || editMessage.attachments || isChannelReadOnly ? (
          <ChannelState
            status={
              editMessage.msg || editMessage.attachments
                ? 'Editing Message'
                : isChannelReadOnly
                ? 'This room is read only'
                : undefined
            }
            iconName={
              editMessage.msg || editMessage.attachments ? 'edit' : undefined
            }
            instructions={
              editMessage.msg || editMessage.attachments
                ? 'esc to cancel · enter to save'
                : undefined
            }
          />
        ) : null}

        {showMembersList && (
          <MembersList
            mentionIndex={mentionIndex}
            filteredMembers={filteredMembers}
            onMemberClick={handleMemberClick}
          />
        )}

        {showCommandList && (
          <CommandsList
            commandIndex={commandIndex}
            filteredCommands={filteredCommands}
            onCommandClick={handleCommandClick}
          />
        )}

        <TypingUsers />
      </Box>
      <Box
        ref={chatInputContainer}
        css={[
          styles.inputWithFormattingBox,
          (editMessage.msg || editMessage.attachments) && styles.editMessage,
        ]}
      >
        <Box css={styles.inputBox}>
          <Input
            textArea
            rows={1}
            disabled={!isUserAuthenticated || !canSendMsg || isRecordingMessage}
            placeholder={
              isUserAuthenticated && canSendMsg
                ? 'Message'
                : isUserAuthenticated
                ? 'This room is read only'
                : 'Sign in to chat'
            }
            css={styles.textInput}
            onChange={onTextChange}
            onBlur={() => {
              sendTypingStop();
              handleBlur();
            }}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            ref={messageRef}
          />

          <input type="file" hidden ref={inputRef} onChange={sendAttachment} />
          <Box
            css={css`
              padding: 0.25rem;
            `}
          >
            {isUserAuthenticated ? (
              <ActionButton
                ghost
                size="large"
                onClick={() => sendMessage()}
                type="primary"
                disabled={disableButton || isRecordingMessage}
                icon="send"
              />
            ) : (
              <Button onClick={onJoin} type="primary">
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
              <Button type="secondary" onClick={closeMsgLongModal}>
                Cancel
              </Button>
              <Button onClick={handleAttachmentConversion} type="primary">
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
