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
  useAiStore,
} from '../../store';
import ChatInputFormattingToolbar from './ChatInputFormattingToolbar';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import MembersList from '../Mentions/MembersList';
import { TypingUsers } from '../TypingUsers';
import createPendingMessage from '../../lib/createPendingMessage';
import { CommandsList } from '../CommandList';
import { EmojiList } from '../EmojiList';
import useSettingsStore from '../../store/settingsStore';
import ChannelState from '../ChannelState/ChannelState';
import QuoteMessage from '../QuoteMessage/QuoteMessage';
import { getChatInputStyles } from './ChatInput.styles';
import useShowCommands from '../../hooks/useShowCommands';
import useSearchMentionUser from '../../hooks/useSearchMentionUser';
import useSearchEmoji from '../../hooks/useSearchEmoji';
import formatSelection from '../../lib/formatSelection';
import { parseEmoji } from '../../lib/emoji';
import useDropBox from '../../hooks/useDropBox';
import useAIComposer from '../../hooks/useAIComposer';
import AIComposerToolbar from '../AIComposerToolbar';

const ChatInput = ({ scrollToBottom, clearUnreadDividerRef }) => {
  const { styleOverrides, classNames } = useComponentOverrides('ChatInput');
  const { RCInstance, ECOptions } = useRCContext();
  const aiAdapter = ECOptions?.aiAdapter ?? null;
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
  const [showEmojiList, setShowEmojiList] = useState(false);
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  const [emojiIndex, setEmojiIndex] = useState(-1);
  const [startReadEmoji, setStartReadEmoji] = useState(false);
  const [isMsgLong, setIsMsgLong] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isAiAvailable, setIsAiAvailable] = useState(false);

  const {
    isAiTyping,
    setIsAiTyping,
    threadSummary,
    showThreadSummary,
    closeThreadSummary,
  } = useAiStore((state) => ({
    isAiTyping: state.isAiTyping,
    setIsAiTyping: state.setIsAiTyping,
    threadSummary: state.threadSummary,
    showThreadSummary: state.showThreadSummary,
    closeThreadSummary: state.closeThreadSummary,
  }));

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

  const {
    editMessage,
    setEditMessage,
    quoteMessage,
    isRecordingMessage,
    upsertMessage,
    replaceMessage,
    removeMessage,
    clearQuoteMessages,
    threadId,
    deletedMessage,
  } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
    quoteMessage: state.quoteMessage,
    isRecordingMessage: state.isRecordingMessage,
    upsertMessage: state.upsertMessage,
    replaceMessage: state.replaceMessage,
    threadId: state.threadMainMessage?._id,
    clearQuoteMessages: state.clearQuoteMessages,
    removeMessage: state.removeMessage,
    deletedMessage: state.deletedMessage,
  }));

  const setIsLoginModalOpen = useLoginStore(
    (state) => state.setIsLoginModalOpen
  );
  const isLoginIn = useLoginStore((state) => state.isLoginIn);

  const { toggle, setData, data } = useAttachmentWindowStore((state) => ({
    toggle: state.toggle,
    setData: state.setData,
    data: state.data,
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

  const { handlePaste } = useDropBox();
  const searchEmoji = useSearchEmoji(
    startReadEmoji,
    setStartReadEmoji,
    setFilteredEmojis,
    setEmojiIndex,
    setShowEmojiList
  );

  useEffect(() => {
    if (!isUserAuthenticated) return;
    RCInstance.getCommandsList()
      .then((response) => setCommands(response.commands || []))
      .catch(console.error);

    RCInstance.getChannelMembers(isChannelPrivate)
      .then((channelMembers) => setMembersHandler(channelMembers.members || []))
      .catch(console.error);
  }, [RCInstance, isUserAuthenticated, isChannelPrivate, setMembersHandler]);

  useEffect(() => {
    if (!aiAdapter) {
      setIsAiAvailable(false);
      return;
    }
    aiAdapter
      .isAvailable()
      .then(setIsAiAvailable)
      .catch(() => setIsAiAvailable(false));
  }, [aiAdapter]);

  useEffect(() => {
    if (editMessage.attachments) {
      messageRef.current.value =
        editMessage.attachments[0]?.description || editMessage.msg;
      messageRef.current.focus();
    } else if (editMessage.msg) {
      messageRef.current.value = editMessage.msg;
      messageRef.current.focus();
    } else {
      messageRef.current.value = '';
    }
  }, [editMessage]);

  useEffect(() => {
    if (
      deletedMessage._id &&
      editMessage._id &&
      deletedMessage._id === editMessage._id
    ) {
      messageRef.current.value = '';
      setDisableButton(true);
      setEditMessage({});
    }
  }, [deletedMessage]);

  useEffect(() => {
    if (data === null && inputRef.current) {
      inputRef.current.value = '';
    }
  }, [data]);

  const getMessageLink = async (id) => {
    const host = RCInstance.getHost();
    const res = await RCInstance.channelInfo();
    return `${host}/channel/${res.room?.name}/?msg=${id}`;
  };

  const handleNewLine = (e, addLine = true) => {
    if (addLine) {
      const { selectionStart, selectionEnd, value } = messageRef.current;
      messageRef.current.value = `${value.substring(
        0,
        selectionStart
      )}\n${value.substring(selectionEnd)}`;
      messageRef.current.selectionStart = messageRef.current.selectionEnd;
      messageRef.current.selectionEnd = selectionStart + 1;
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

  const sendTypingStart = () => {
    if (typingRef.current && messageRef.current.value?.length) {
      return;
    }
    if (messageRef.current.value?.length) {
      typingRef.current = true;
      timerRef.current = setTimeout(() => {
        typingRef.current = false;
      }, [15000]);
      RCInstance.sendTypingStatus(username, true).catch(() => {});
    } else {
      clearTimeout(timerRef.current);
      typingRef.current = false;
      RCInstance.sendTypingStatus(username, false).catch(() => {});
    }
  };

  const sendTypingStop = () => {
    typingRef.current = false;
    RCInstance.sendTypingStatus(username, false).catch(() => {});
  };

  const handleSendNewMessage = async (message) => {
    messageRef.current.value = '';
    setDisableButton(true);

    let pendingMessage = '';
    let quotedMessages = '';

    if (quoteMessage.length > 0) {
      // for (const quote of quoteMessage) {
      //   const { msg, attachments, _id } = quote;
      //   if (msg || attachments) {
      //     const msgLink = await getMessageLink(_id);
      //     quotedMessages += `[ ](${msgLink})`;
      //   }
      // }

      const quoteArray = await Promise.all(
        quoteMessage.map(async (quote) => {
          const { msg, attachments, _id } = quote;
          if (msg || attachments) {
            const msgLink = await getMessageLink(_id);
            quotedMessages += `[ ](${msgLink})`;
          }
          return quotedMessages;
        })
      );
      quotedMessages = quoteArray.join('');
      pendingMessage = createPendingMessage(
        `${quotedMessages}\n${message}`,
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

    if (res?.success) {
      clearQuoteMessages();
      replaceMessage(pendingMessage._id, res.message);

      if (aiAdapter && ECOptions.aiAutoReply) {
        const { messages: currentMessages } = useMessageStore.getState();
        const aiContext = {
          roomId: ECOptions.roomId,
          userId,
          history: currentMessages.slice(-20),
        };
        aiAdapter
          .sendPrompt(aiContext, pendingMessage.msg)
          .then((response) => {
            if (response?.text) {
              RCInstance.sendMessage(
                { msg: response.text },
                ECOptions.enableThreads ? threadId : undefined
              ).catch(() => {});
            }
          })
          .catch((e) => {
            console.error('[AI Adapter] sendPrompt failed:', e);
          });
      }
    } else {
      // If REST send failed, remove the pending message so it doesn't stay grey
      removeMessage(pendingMessage._id);
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
      await RCInstance.execCommand({ command, params, tmid: threadId });
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

  const aiComposer = useAIComposer({
    aiAdapter,
    ECOptions,
    userId,
    messageRef,
    messages: useMessageStore.getState().messages,
  });

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
    setAiSuggestions([]);
    aiComposer.rejectSuggestion(); // dismiss any pending AI suggestion
    // Clear unread divider when user sends a message
    if (clearUnreadDividerRef?.current) {
      clearUnreadDividerRef.current();
    }
  };

  useEffect(() => {
    if (!isUserAuthenticated) {
      setAiSuggestions([]);
      setSummary('');
      setShowSummary(false);
    }
  }, [isUserAuthenticated]);

  const handleGetSuggestions = async () => {
    if (!aiAdapter || isFetchingSuggestions) return;
    setIsFetchingSuggestions(true);
    setIsAiTyping(true);
    try {
      const { messages } = useMessageStore.getState();
      const aiContext = {
        roomId: ECOptions.roomId,
        userId,
        history: messages.slice(-10),
      };
      const suggestions = aiAdapter.getSuggestions
        ? await aiAdapter.getSuggestions(messages.slice(-10), aiContext)
        : [];
      setAiSuggestions(suggestions);
    } catch (e) {
      console.error('[AI Adapter] getSuggestions failed:', e);
      dispatchToastMessage({
        type: 'error',
        message: 'Failed to generate suggestions. Please check your settings.',
      });
    } finally {
      setIsFetchingSuggestions(false);
      setIsAiTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    messageRef.current.value = suggestion;
    setDisableButton(false);
    setAiSuggestions([]);
    messageRef.current.focus();
  };

  const handleSummarize = async () => {
    if (!aiAdapter?.summarize || isSummarizing) return;
    setIsSummarizing(true);
    setIsAiTyping(true);
    try {
      const { messages } = useMessageStore.getState();
      const result = await aiAdapter.summarize(messages, {
        roomId: ECOptions.roomId,
        userId,
        history: messages.slice(-20),
      });
      setSummary(result);
      setShowSummary(true);
    } catch (e) {
      console.error('[AI Adapter] summarize failed:', e);
      dispatchToastMessage({
        type: 'error',
        message: 'Failed to generate summary. Please check your settings.',
      });
    } finally {
      setIsSummarizing(false);
      setIsAiTyping(false);
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

  const onTextChange = (e, val) => {
    sendTypingStart();
    const message = val || e.target.value;

    const shouldParseEmoji = !message.match(/:([a-zA-Z0-9_+-]*?)$/);
    messageRef.current.value = shouldParseEmoji ? parseEmoji(message) : message;

    setDisableButton(!messageRef.current.value.length);
    if (e !== null) {
      handleNewLine(e, false);
      searchMentionUser(message);
      showCommands(e.target.selectionStart, e.target.value);
      searchEmoji(message);
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

  const handlePasting = (event) => {
    const { clipboardData } = event;

    if (!clipboardData) {
      return;
    }

    const items = Array.from(clipboardData.items);
    if (
      items.some(({ kind, type }) => kind === 'string' && type === 'text/plain')
    ) {
      return;
    }

    const files = items
      .filter(
        (item) => item.kind === 'file' && item.type.indexOf('image/') !== -1
      )
      .map((item) => {
        const fileItem = item.getAsFile();

        if (!fileItem) {
          return;
        }
        return fileItem;
      })
      .filter((file) => !!file);

    if (files.length) {
      event.preventDefault();
      handlePaste(files[0]);
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
        if (!showCommandList && !showMembersList && !showEmojiList) {
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
        <div>
          {quoteMessage &&
            quoteMessage.length > 0 &&
            quoteMessage.map((message, index) => (
              <QuoteMessage message={message} key={index} />
            ))}
        </div>
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

        {showEmojiList && (
          <EmojiList
            emojiIndex={emojiIndex}
            messageRef={messageRef}
            filteredEmojis={filteredEmojis}
            setFilteredEmojis={setFilteredEmojis}
            setEmojiIndex={setEmojiIndex}
            setStartReadEmoji={setStartReadEmoji}
            setShowEmojiList={setShowEmojiList}
          />
        )}

        <TypingUsers extraUsers={isAiTyping ? [aiAdapter?.name ?? 'AI'] : []} />
      </Box>
      {/* AI Composer Toolbar — selection-based actions */}
      {isAiAvailable && isUserAuthenticated && (
        <AIComposerToolbar
          showToolbar={aiComposer.showToolbar}
          suggestion={aiComposer.suggestion}
          isProcessing={aiComposer.isProcessing}
          activeAction={aiComposer.activeAction}
          actions={aiComposer.actions}
          onAction={aiComposer.runAction}
          onAccept={aiComposer.acceptSuggestion}
          onReject={aiComposer.rejectSuggestion}
        />
      )}
      {aiSuggestions.length > 0 && (
        <Box css={styles.aiSuggestionsContainer}>
          {aiSuggestions.map((s) => (
            <Button
              key={s}
              size="small"
              type="secondary"
              onClick={() => handleSuggestionClick(s)}
              css={styles.aiSuggestionChip}
            >
              {s}
            </Button>
          ))}
        </Box>
      )}
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
            onMouseUp={aiComposer.handleMouseUp}
            onKeyUp={aiComposer.handleKeyUp}
            onBlur={() => {
              sendTypingStop();
              handleBlur();
            }}
            onFocus={handleFocus}
            onKeyDown={onKeyDown}
            onPaste={handlePasting}
            ref={messageRef}
          />

          <input type="file" hidden ref={inputRef} onChange={sendAttachment} />
          <Box css={styles.actionButtonsContainer}>
            {isAiAvailable && isUserAuthenticated && !isChannelArchived && (
              <ActionButton
                ghost
                size="large"
                onClick={handleGetSuggestions}
                disabled={isFetchingSuggestions}
                title="Get AI reply suggestions"
                aria-label="Get AI reply suggestions"
                css={styles.aiActionButton}
              >
                {isFetchingSuggestions ? <Throbber /> : '\u2728'}
              </ActionButton>
            )}
            {isAiAvailable &&
              aiAdapter?.summarize &&
              isUserAuthenticated &&
              !isChannelArchived && (
                <ActionButton
                  ghost
                  size="large"
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  title="Summarize chat"
                  aria-label="Summarize chat"
                  css={styles.aiActionButton}
                >
                  {isSummarizing ? <Throbber /> : '\ud83d\udcdd'}
                </ActionButton>
              )}
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
              <Button
                onClick={() => onJoin()}
                type="primary"
                disabled={isLoginIn}
              >
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
          />
        )}
      </Box>
      {showSummary && (
        <Modal css={styles.summaryModal} onClose={() => setShowSummary(false)}>
          <Modal.Header>
            <Modal.Title>📝 Chat Summary</Modal.Title>
            <Modal.Close onClick={() => setShowSummary(false)} />
          </Modal.Header>
          <Modal.Content css={styles.summaryModalContent}>
            {summary}
          </Modal.Content>
          <Modal.Footer>
            <Button type="primary" onClick={() => setShowSummary(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {isMsgLong && (
        <Modal
          css={styles.longMessageModal}
          onClose={() => setIsMsgLong(false)}
        >
          <Modal.Header>
            <Modal.Title>
              <Icon name="report" size="1.25rem" />
              Message Too Long!
            </Modal.Title>
            <Modal.Close onClick={() => setIsMsgLong(false)} />
          </Modal.Header>
          <Modal.Content css={styles.longMessageModalContent}>
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
      {showThreadSummary && (
        <Modal css={styles.summaryModal} onClose={closeThreadSummary}>
          <Modal.Header>
            <Modal.Title>📝 Thread Summary</Modal.Title>
            <Modal.Close onClick={closeThreadSummary} />
          </Modal.Header>
          <Modal.Content css={styles.summaryModalContent}>
            {threadSummary}
          </Modal.Content>
          <Modal.Footer>
            <Button type="primary" onClick={closeThreadSummary}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Box>
  );
};

export default ChatInput;
