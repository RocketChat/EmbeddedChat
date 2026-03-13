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
// createPendingMessage is now used internally by useSendMessage
import { CommandsList } from '../CommandList';
import useSettingsStore from '../../store/settingsStore';
import ChannelState from '../ChannelState/ChannelState';
import { getChatInputStyles } from './ChatInput.styles';
import useShowCommands from '../../hooks/useShowCommands';
import useSearchMentionUser from '../../hooks/useSearchMentionUser';
import { parseEmoji } from '../../lib/emoji';
import { useChatInputState } from '../../hooks/useChatInputState';
import { useSendMessage } from '../../hooks/useSendMessage';
import QuoteChip from './QuoteChip';

const ChatInput = ({ scrollToBottom, clearUnreadDividerRef }) => {
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
  const [msgLongText, setMsgLongText] = useState('');

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

  const {
    isChannelPrivate,
    isChannelReadOnly,
    channelInfo,
    isChannelArchived,
  } = useChannelStore((state) => ({
    isChannelPrivate: state.isChannelPrivate,
    isChannelReadOnly: state.isChannelReadOnly,
    channelInfo: state.channelInfo,
    isChannelArchived: state.isChannelArchived,
  }));

  const { members, setMembersHandler } = useMemberStore((state) => ({
    members: state.members,
    setMembersHandler: state.setMembersHandler,
  }));

  const msgMaxLength = useSettingsStore((state) => state.messageLimit);

  const { isRecordingMessage, threadId, deletedMessage } = useMessageStore(
    (state) => ({
      isRecordingMessage: state.isRecordingMessage,
      threadId: state.threadMainMessage?._id,
      deletedMessage: state.deletedMessage,
    })
  );

  const setIsLoginModalOpen = useLoginStore(
    (state) => state.setIsLoginModalOpen
  );
  const isLoginIn = useLoginStore((state) => state.isLoginIn);

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

  const {
    text,
    setText,
    insertText,
    quotes,
    removeQuote,
    clearQuotes,
    getFinalMarkdown,
    formatSelection,
    editMessage,
    setEditMessage,
  } = useChatInputState(messageRef, RCInstance);

  const userInfo = { _id: userId, username, name };

  const { sendNewMessage, sendEditedMessage, sendCommand, sendAsAttachment } =
    useSendMessage({
      RCInstance,
      ECOptions,
      username,
      commands,
      threadId,
      getFinalMarkdown,
      setText,
      clearQuotes,
      setEditMessage,
      setDisableButton,
      setFilteredCommands,
    });

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
    if (editMessage.attachments || editMessage.msg) {
      messageRef.current.focus();
    }
  }, [editMessage]);

  useEffect(() => {
    if (
      deletedMessage._id &&
      editMessage._id &&
      deletedMessage._id === editMessage._id
    ) {
      setText('');
      setDisableButton(true);
      setEditMessage({});
    }
  }, [deletedMessage, editMessage, setEditMessage, setText]);

  const handleNewLine = (e, addLine = true) => {
    if (addLine) {
      insertText('\n');
    }

    e.target.style.height = 'auto';
    if (e.target.scrollHeight <= 150) {
      e.target.style.boxSizing = 'border-box';
      e.target.style.height = `${e.target.scrollHeight}px`;
    } else {
      e.target.style.height = '150px';
    }
  };

  const textToAttach = () => {
    setIsMsgLong(false);
    sendAsAttachment(msgLongText);
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
        }, 10000);
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
      if (timerRef.current) clearTimeout(timerRef.current);
      typingRef.current = false;
      await RCInstance.sendTypingStatus(username, false);
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async () => {
    messageRef.current.focus();
    messageRef.current.style.height = '44px';
    const currentMessage = text.trim();

    if (!currentMessage.length || !isUserAuthenticated) {
      setText('');
      if (editMessage.msg || editMessage.attachments) {
        setEditMessage({});
      }
      return;
    }

    if (currentMessage.length > msgMaxLength) {
      setMsgLongText(currentMessage);
      setIsMsgLong(true);
      return;
    }

    if (editMessage.msg || editMessage.attachments) {
      await sendEditedMessage(editMessage._id, currentMessage);
      return;
    }

    if (currentMessage.startsWith('/')) {
      await sendCommand(currentMessage);
      return;
    }

    await sendNewMessage(userInfo);
    scrollToBottom();
    // Clear unread divider when user sends a message
    if (clearUnreadDividerRef?.current) {
      clearUnreadDividerRef.current();
    }
  };

  const { toggle: toggleAttachmentWindow, setData: setAttachmentData } =
    useAttachmentWindowStore((state) => ({
      toggle: state.toggle,
      setData: state.setData,
    }));

  const sendAttachment = (event) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }
    toggleAttachmentWindow();
    setAttachmentData(event.target.files[0]);
  };

  const onTextChange = (e, val) => {
    sendTypingStart();
    const message = val || e.target.value;
    const emojiParsedMessage = parseEmoji(message);
    setText(emojiParsedMessage);
    setDisableButton(!emojiParsedMessage.length);
    if (e !== null) {
      handleNewLine(e, false);
      searchMentionUser(message);
      showCommands(e);
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

  const onKeyDown = (e) => {
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
        if (editMessage.msg || editMessage.attachments) {
          e.preventDefault();
          setText('');
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
      case (e.ctrlKey || e.altKey) && e.code === 'ArrowLeft': {
        e.preventDefault();
        if (messageRef && messageRef.current) {
          const { value, selectionStart } = messageRef.current;
          let newPosition = selectionStart;

          while (newPosition > 0 && /\s/.test(value[newPosition - 1])) {
            newPosition -= 1;
          }
          while (newPosition > 0 && !/\s/.test(value[newPosition - 1])) {
            newPosition -= 1;
          }

          messageRef.current.setSelectionRange(newPosition, newPosition);
          messageRef.current.focus();
        }
        break;
      }
      case (e.ctrlKey || e.altKey) && e.code === 'ArrowRight': {
        e.preventDefault();
        if (messageRef && messageRef.current) {
          const { value, selectionEnd } = messageRef.current;
          let newPosition = selectionEnd;

          while (newPosition < value.length && /\s/.test(value[newPosition])) {
            newPosition += 1;
          }
          while (newPosition < value.length && !/\s/.test(value[newPosition])) {
            newPosition += 1;
          }

          messageRef.current.setSelectionRange(newPosition, newPosition);
          messageRef.current.focus();
        }
        break;
      }
      case (e.ctrlKey || e.altKey) && e.code === 'ArrowUp': {
        e.preventDefault();
        if (messageRef && messageRef.current) {
          messageRef.current.setSelectionRange(0, 0);
          messageRef.current.focus();
        }
        break;
      }
      case (e.ctrlKey || e.altKey) && e.code === 'ArrowDown': {
        e.preventDefault();
        if (messageRef && messageRef.current) {
          const { current } = messageRef;
          const { value } = current;
          const { length } = value;
          messageRef.current.setSelectionRange(length, length);
          messageRef.current.focus();
        }
        break;
      }
      default:
        break;
    }
  };

  return (
    <Box className={`ec-chat-input ${classNames}`} style={styleOverrides}>
      <Box css={styles.quoteContainer}>
        <Box css={styles.quoteList}>
          {quotes &&
            quotes.length > 0 &&
            quotes.map((message, index) => (
              <QuoteChip 
                message={message} 
                key={index} 
                onRemove={removeQuote}
              />
            ))}
        </Box>
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
        <Box
          css={css`
            margin: 0rem 2rem;
          `}
        >
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
        </Box>

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
            disabled={
              !isUserAuthenticated ||
              !canSendMsg ||
              isRecordingMessage ||
              isChannelArchived
            }
            placeholder={
              isUserAuthenticated
                ? isChannelArchived
                  ? 'Room archived'
                  : canSendMsg
                  ? `Message #${channelInfo.name}`
                  : 'This room is read only'
                : 'Sign in to chat'
            }
            css={css`
              ${styles.textInput}
              ${isChannelArchived &&
              isUserAuthenticated &&
              `text-align: center;`}
            `}
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
              !isChannelArchived ? (
                <ActionButton
                  ghost
                  size="large"
                  onClick={() => sendMessage()}
                  type="primary"
                  disabled={disableButton || isRecordingMessage}
                  icon="send"
                />
              ) : null
            ) : (
              <Button onClick={onJoin} type="primary" disabled={isLoginIn}>
                {isLoginIn ? <Throbber /> : 'JOIN'}
              </Button>
            )}
          </Box>
        </Box>
        {isUserAuthenticated && !isChannelArchived && (
          <ChatInputFormattingToolbar
            messageRef={messageRef}
            inputRef={inputRef}
            triggerButton={onTextChange}
            formatSelection={formatSelection}
            insertText={insertText}
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
