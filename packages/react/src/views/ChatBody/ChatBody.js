/* eslint-disable no-shadow */
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import {
  Box,
  Throbber,
  useComponentOverrides,
  Modal,
  useTheme,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import {
  useMessageStore,
  useUserStore,
  useChannelStore,
  useLoginStore,
} from '../../store';
import MessageList from '../MessageList';
import TotpModal from '../TotpModal/TwoFactorTotpModal';
import { useRCAuth } from '../../hooks/useRCAuth';
import LoginForm from '../LoginForm/LoginForm';
import ThreadMessageList from '../Thread/ThreadMessageList';
import RecentMessageButton from './RecentMessageButton';
import useFetchChatData from '../../hooks/useFetchChatData';
import { getChatbodyStyles } from './ChatBody.styles';
import UiKitModal from '../ModalBlock/uiKit/UiKitModal';
import useUiKitStore from '../../store/uiKitStore';
import useUiKitActionManager from '../../hooks/uiKit/useUiKitActionManager';

const ChatBody = ({
  anonymousMode,
  showRoles,
  messageListRef,
  scrollToBottom,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ChatBody');
  const { theme, mode } = useTheme();
  const styles = getChatbodyStyles(theme, mode);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [, setIsUserScrolledUp] = useState(false);
  const [otherUserMessage, setOtherUserMessage] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { RCInstance, ECOptions } = useContext(RCContext);
  const showAnnouncement = ECOptions?.showAnnouncement;
  const messages = useMessageStore((state) => state.messages);
  const threadMessages = useMessageStore((state) => state.threadMessages);
  const [isModalOpen, setModalOpen] = useState(false);
  const setThreadMessages = useMessageStore((state) => state.setThreadMessages);
  const upsertMessage = useMessageStore((state) => state.upsertMessage);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [offset, setOffset] = useState(50);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const removeMessage = useMessageStore((state) => state.removeMessage);
  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);
  const channelInfo = useChannelStore((state) => state.channelInfo);
  const isLoginIn = useLoginStore((state) => state.isLoginIn);
  const setMessages = useMessageStore((state) => state.setMessages);

  const [isThreadOpen, threadMainMessage] = useMessageStore((state) => [
    state.isThreadOpen,
    state.threadMainMessage,
  ]);

  const { uiKitModalOpen, uiKitModalData } = useUiKitStore((state) => ({
    uiKitModalOpen: state.uiKitModalOpen,
    uiKitModalData: state.uiKitModalData,
  }));

  const { handleLogin } = useRCAuth();
  const { handleServerInteraction } = useUiKitActionManager();

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const username = useUserStore((state) => state.username);

  const { getMessagesAndRoles } = useFetchChatData(showRoles);

  const getThreadMessages = useCallback(async () => {
    if (isUserAuthenticated && threadMainMessage?._id) {
      try {
        if (!isUserAuthenticated && !anonymousMode) {
          return;
        }
        const { messages } = await RCInstance.getThreadMessages(
          threadMainMessage._id,
          isChannelPrivate
        );
        setThreadMessages(messages);
      } catch (e) {
        console.error(e);
      }
    }
  }, [
    isUserAuthenticated,
    anonymousMode,
    RCInstance,
    threadMainMessage?._id,
    setThreadMessages,
    isChannelPrivate,
  ]);

  useEffect(() => {
    if (isThreadOpen && ECOptions.enableThreads) {
      getThreadMessages();
    }
  }, [getThreadMessages, isThreadOpen, ECOptions?.enableThreads]);

  const addMessage = useCallback(
    (message) => {
      if (message.u.username !== username) {
        const isScrolledUp = messageListRef?.current?.scrollTop !== 0;
        if (isScrolledUp && !('pinned' in message) && !('starred' in message)) {
          setOtherUserMessage(true);
        }
      }
      upsertMessage(message, ECOptions?.enableThreads);
    },
    [upsertMessage, ECOptions?.enableThreads, username, messageListRef]
  );

  const onActionTriggerResponse = useCallback(
    (data) => {
      handleServerInteraction(data);
    },
    [handleServerInteraction]
  );

  useEffect(() => {
    RCInstance.auth.onAuthChange((user) => {
      if (user) {
        RCInstance.addMessageListener(addMessage);
        RCInstance.addMessageDeleteListener(removeMessage);
        RCInstance.addActionTriggeredListener(onActionTriggerResponse);
        RCInstance.addUiInteractionListener(onActionTriggerResponse);
      }
    });

    return () => {
      RCInstance.removeMessageListener(addMessage);
      RCInstance.removeMessageDeleteListener(removeMessage);
      RCInstance.removeActionTriggeredListener(onActionTriggerResponse);
      RCInstance.removeUiInteractionListener(onActionTriggerResponse);
    };
  }, [RCInstance, addMessage, removeMessage, onActionTriggerResponse]);

  useEffect(() => {
    RCInstance.auth.onAuthChange((user) => {
      if (user) {
        setOffset(50);
        getMessagesAndRoles();
        setHasMoreMessages(true);
      } else {
        getMessagesAndRoles(anonymousMode);
      }
    });
  }, [RCInstance, anonymousMode, getMessagesAndRoles]);

  const handlePopupClick = () => {
    scrollToBottom();
    setIsUserScrolledUp(false);
    setOtherUserMessage(false);
    setPopupVisible(false);
  };

  const handleScroll = useCallback(async () => {
    if (messageListRef && messageListRef.current) {
      setScrollPosition(messageListRef.current.scrollTop);
      setIsUserScrolledUp(
        messageListRef.current.scrollTop + messageListRef.current.clientHeight <
          messageListRef.current.scrollHeight
      );

      if (
        messageListRef.current.scrollTop === 0 &&
        !loadingOlderMessages &&
        hasMoreMessages
      ) {
        setLoadingOlderMessages(true);

        try {
          const olderMessages = await RCInstance.getOlderMessages(
            anonymousMode,
            ECOptions?.enableThreads
              ? {
                  query: {
                    tmid: {
                      $exists: false,
                    },
                  },
                  offset: offset,
                }
              : undefined,
            anonymousMode ? false : isChannelPrivate
          );
          const messageList = messageListRef.current;
          if (olderMessages?.messages?.length) {
            const previousScrollHeight = messageList.scrollHeight;

            setMessages(olderMessages.messages, true);
            setOffset((prevOffset) => prevOffset + 50);

            requestAnimationFrame(() => {
              const newScrollHeight = messageList.scrollHeight;
              messageList.scrollTop = newScrollHeight - previousScrollHeight;
            });
          } else {
            setHasMoreMessages(false);
          }
        } catch (error) {
          console.error('Error fetching older messages:', error);
          setHasMoreMessages(false);
        } finally {
          setLoadingOlderMessages(false);
        }
      }
    }

    const isAtBottom = messageListRef?.current?.scrollTop === 0;
    if (isAtBottom) {
      setPopupVisible(false);
      setIsUserScrolledUp(false);
      setOtherUserMessage(false);
    }
  }, [
    messageListRef,
    offset,
    setMessages,
    anonymousMode,
    hasMoreMessages,
    RCInstance,
    isChannelPrivate,
    ECOptions?.enableThreads,
    loadingOlderMessages,
    setScrollPosition,
    setIsUserScrolledUp,
    setPopupVisible,
    setOtherUserMessage,
  ]);

  const showNewMessagesPopup = () => {
    setPopupVisible(true);
  };
  const announcementRef = useRef(null);

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const checkOverflow = () => {
    if (announcementRef.current) {
      setIsOverflowing(
        announcementRef.current.scrollWidth >
          announcementRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    checkOverflow();
  }, [channelInfo.announcement, showAnnouncement]);
  useEffect(() => {
    const currentRef = messageListRef.current;
    currentRef.addEventListener('scroll', handleScroll);

    return () => {
      currentRef.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, messageListRef]);

  useEffect(() => {
    const isScrolledUp =
      scrollPosition + messageListRef.current.clientHeight <
      messageListRef.current.scrollHeight;

    if (isScrolledUp && otherUserMessage) {
      showNewMessagesPopup();
    }
  }, [scrollPosition, otherUserMessage, messageListRef]);

  return (
    <>
      {channelInfo.announcement && showAnnouncement && (
        <Box css={styles.announcementStyles}>
          <Box
            ref={announcementRef}
            css={[
              styles.announcementTextBox,
              css`
                &:hover {
                  text-decoration: ${isOverflowing ? 'underline' : 'none'};
                  cursor: ${isOverflowing ? 'pointer' : 'default'};
                }
              `,
            ]}
            onClick={isOverflowing ? toggleModal : undefined}
          >
            {channelInfo.announcement}
          </Box>
        </Box>
      )}
      {isModalOpen && (
        <Modal>
          <Modal.Header>
            <Modal.Title>Announcement</Modal.Title>
            <Modal.Close onClick={toggleModal} />
          </Modal.Header>
          <Modal.Content
            css={css`
              height: 300px;
              word-wrap: break-word;
              overflow-wrap: anywhere;
              white-space: normal;
              padding: 20px;
            `}
          >
            {channelInfo.announcement}
          </Modal.Content>
        </Modal>
      )}
      <Box
        ref={messageListRef}
        css={styles.chatbodyContainer}
        style={{
          ...styleOverrides,
        }}
        className={`ec-chat-body ${classNames}`}
      >
        {isLoginIn ? (
          <Box
            css={css`
              margin: auto;
              text-align: center;
            `}
          >
            <Throbber />
          </Box>
        ) : isThreadOpen ? (
          <ThreadMessageList
            threadMainMessage={threadMainMessage}
            threadMessages={threadMessages}
          />
        ) : (
          <MessageList
            messages={messages}
            loadingOlderMessages={loadingOlderMessages}
            isUserAuthenticated={isUserAuthenticated}
            hasMoreMessages={hasMoreMessages}
          />
        )}

        <TotpModal handleLogin={handleLogin} />
        <LoginForm />

        {uiKitModalOpen && (
          <UiKitModal key={Math.random()} initialView={uiKitModalData} />
        )}
      </Box>

      {popupVisible && otherUserMessage && (
        <RecentMessageButton
          visible
          text="New messages"
          onClick={handlePopupClick}
        />
      )}
    </>
  );
};

export default ChatBody;

ChatBody.propTypes = {
  anonymousMode: PropTypes.bool,
  showRoles: PropTypes.bool,
};
