import React, { useState, useRef, useEffect } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Button,
  Input,
  Icon,
  ActionButton,
  Modal,
  Throbber,
  useToastBarDispatch,
  useComponentOverrides,
  useTheme,
} from '@embeddedchat/ui-elements';
import { useRCContext } from '../../context/RCInstance';
import {
  useUserStore,
  useMessageStore,
  useLoginStore,
  useChannelStore,
  useMemberStore,
} from '../../store';
import ChatInputFormattingToolbar from './ChatInputFormattingToolbar';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import MembersList from '../Mentions/MembersList';
import { TypingUsers } from '../TypingUsers';
import createPendingMessage from '../../lib/createPendingMessage';
import { parseEmoji } from '../../lib/emoji';
import { CommandsList } from '../CommandList';
import useSettingsStore from '../../store/settingsStore';
import ChannelState from '../ChannelState/ChannelState';
import QuoteMessage from '../QuoteMessage/QuoteMessage';
import { getChatInputStyles } from './ChatInput.styles';
import useShowCommands from '../../hooks/useShowCommands';
import useSearchMentionUser from '../../hooks/useSearchMentionUser';
import formatSelection from '../../lib/formatSelection';

const ChatInput = ({ scrollToBottom }) => {
  const { styleOverrides, classNames } = useComponentOverrides('ChatInput');
  const { RCInstance, ECOptions } = useRCContext();
  const { theme } = useTheme();
  const styles = getChatInputStyles(theme);

  const inputRef = useRef(null);
  const typingRef = useRef();
  const messageRef = useRef(null);
  const chatInputContainer = useRef(null);
  const timerRef = useRef();

  const [commands, setCommands] = useState([]);
  const [disableButton, setDisableButton] = useState(true);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [mentionIndex, setMentionIndex] = useState(-1);
  const [commandIndex, setCommandIndex] = useState(0);
  const [startReadMentionUser, setStartReadMentionUser] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);
  const [showCommandList, setShowCommandList] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [isMsgLong, setIsMsgLong] = useState(false);

  const {
    isUserAuthenticated,
    canSendMsg,
    setIsUserAuthenticated,
    username,
    userId,
    name,
  } = useUserStore((state) => ({
    isUserAuthenticated: state.isUserAuthenticated,
    canSendMsg: state.canSendMsg,
    setIsUserAuthenticated: state.setIsUserAuthenticated,
    username: state.username,
    userId: state.userId,
    name: state.name,
  }));

  const { isChannelPrivate, isChannelReadOnly } = useChannelStore((state) => ({
    isChannelPrivate: state.isChannelPrivate,
    isChannelReadOnly: state.isChannelReadOnly,
  }));

  const { members, setMembersHandler } = useMemberStore((state) => ({
    members: state.members,
    setMembersHandler: state.setMembersHandler,
  }));

  const msgMaxLength = useSettingsStore((state) => state.messageLimit);

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

  const setIsLoginModalOpen = useLoginStore(
    (state) => state.setIsLoginModalOpen
  );
  const isLoginIn = useLoginStore((state) => state.isLoginIn);

  const { toggle, setData } = useAttachmentWindowStore((state) => ({
    toggle: state.toggle,
    setData: state.setData,
  }));

  const userInfo = { _id: userId, username, name };

  const dispatchToastMessage = useToastBarDispatch();
  const showCommands = useShowCommands(
    commands,
    setFilteredCommands,
    setShowCommandList
  );

  const searchMentionUser = useSearchMentionUser(
    members,
    startReadMentionUser,
    setStartReadMentionUser,
    setFilteredMembers,
    setMentionIndex,
    setShowMembersList
  );

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
  }, [RCInstance, isChannelPrivate, setMembersHandler]);

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

  const getMessageLink = async (id) => {
    const host = RCInstance.getHost();
    const res = await RCInstance.channelInfo();
    return `${host}/channel/${res.room?.name}/?msg=${id}`;
  };

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

  const textToAttach = () => {
    const message = messageRef.current.value.trim();
    messageRef.current.value = '';
    setEditMessage({});
    setIsMsgLong(false);
    const messageBlob = new Blob([message], { type: 'text/plain' });
    const file = new File([messageBlob], 'message.txt', {
      type: 'text/plain',
      lastModified: Date.now(),
    });

    toggle();
    setData(file);
  };

  const handleSendError = async (errorMessage) => {
    await RCInstance.logout();
    setIsUserAuthenticated(false);
    dispatchToastMessage({
      type: 'error',
      message: errorMessage,
    });
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
        setIsLoginModalOpen(true);
      }
    }
  };

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

  const handleSendNewMessage = async (message) => {
    messageRef.current.value = '';
    setDisableButton(true);

    const { msg, attachments, _id } = quoteMessage;
    let pendingMessage = '';

    if (msg || attachments) {
      setQuoteMessage({});
      const msgLink = await getMessageLink(_id);
      pendingMessage = createPendingMessage(
        `[ ](${msgLink})\n ${message}`,
        userInfo
      );
    } else {
      pendingMessage = createPendingMessage(message, userInfo);
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
      handleSendError('Error sending message, login again');
    } else {
      replaceMessage(pendingMessage._id, res.message);
    }
  };

  const handleEditMessage = async (message) => {
    messageRef.current.value = '';
    setDisableButton(true);
    const editMessageId = editMessage._id;
    setEditMessage({});

    const res = await RCInstance.updateMessage(
      editMessageId,
      message.replace(/\n/g, '\\n')
    );
    if (!res.success) {
      handleSendError('Error editing message, login again');
    }
  };

  const handleCommandExecution = async (message) => {
    const execCommand = async (command, params) => {
      await RCInstance.execCommand({ command, params });
      setFilteredCommands([]);
    };

    const [command, ...paramsArray] = message.split(' ');
    const params = paramsArray.join(' ');

    if (commands.find((c) => c.command === command.replace('/', ''))) {
      messageRef.current.value = '';
      setDisableButton(true);
      setEditMessage({});
      await execCommand(command.replace('/', ''), params);
    }
  };

  const sendMessage = async () => {
    messageRef.current.focus();
    messageRef.current.style.height = '44px';
    const message = messageRef.current.value.trim();

    if (!message.length || !isUserAuthenticated) {
      messageRef.current.value = '';
      if (editMessage.msg || editMessage.attachments) {
        setEditMessage({});
      }
      return;
    }

    if (message.length > msgMaxLength) {
      setIsMsgLong(true);
      return;
    }

    if (editMessage.msg || editMessage.attachments) {
      handleEditMessage(message);
      return;
    }
    if (message.startsWith('/')) {
      handleCommandExecution(message);
      return;
    }

    handleSendNewMessage(message);
    scrollToBottom();
  };

  const sendAttachment = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    toggle();
    setData(event.target.files[0]);
  };

  const onTextChange = (e) => {
    sendTypingStart();
    const message = e.target.value;
    messageRef.current.value = parseEmoji(message);
    setDisableButton(!messageRef.current.value.length);
    handleNewLine(e, false);
    searchMentionUser(message);
    showCommands(e);
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

  const onKeyDown = (e) => {
    switch (true) {
      case e.ctrlKey && e.code === 'KeyI': {
        e.preventDefault();
        formatSelection(messageRef, '_{{text}}_');
        break;
      }
      case e.ctrlKey && e.code === 'KeyB': {
        e.preventDefault();
        formatSelection(messageRef, '*{{text}}*');
        break;
      }
      case (e.ctrlKey || e.metaKey || e.shiftKey) && e.code === 'Enter':
        e.preventDefault();
        handleNewLine(e);
        break;
      case e.code === 'Escape':
        if (editMessage.msg || editMessage.attachments) {
          e.preventDefault();
          messageRef.current.value = '';
          setDisableButton(true);
          setEditMessage({});
        }
        break;

      case e.code === 'Enter':
        e.preventDefault();
        if (!showCommandList && !showMembersList) {
          sendTypingStop();
          sendMessage();
        }
        break;
      default:
        break;
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
            messageRef={messageRef}
            mentionIndex={mentionIndex}
            setMentionIndex={setMentionIndex}
            filteredMembers={filteredMembers}
            setFilteredMembers={setFilteredMembers}
            setStartReadMentionUser={setStartReadMentionUser}
            setShowMembersList={setShowMembersList}
          />
        )}

        {showCommandList && (
          <CommandsList
            commandIndex={commandIndex}
            filteredCommands={filteredCommands}
            setCommandIndex={setCommandIndex}
            messageRef={messageRef}
            setFilteredCommands={setFilteredCommands}
            setShowCommandList={setShowCommandList}
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
              <Button onClick={onJoin} type="primary" disabled={isLoginIn}>
                {isLoginIn ? <Throbber /> : 'JOIN'}
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
        <Modal
          css={css`
            padding: 1em;
          `}
          onClose={() => setIsMsgLong(false)}
        >
          <Modal.Header>
            <Modal.Title>
              <Icon name="report" size="1.25rem" />
              Message Too Long!
            </Modal.Title>
            <Modal.Close onClick={() => setIsMsgLong(false)} />
          </Modal.Header>
          <Modal.Content
            css={css`
              margin: 1em;
            `}
          >
            Send it as attachment instead?
          </Modal.Content>
          <Modal.Footer>
            <Button type="secondary" onClick={() => setIsMsgLong(false)}>
              Cancel
            </Button>
            <Button onClick={textToAttach} type="primary">
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Box>
  );
};

export default ChatInput;
