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
  Button,
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
  clearUnreadDividerRef,
}) => {
  const getMaxScrollTop = (messageList) =>
    Math.max(0, messageList.scrollHeight - messageList.clientHeight);

  const isAtBottom = (messageList) =>
    getMaxScrollTop(messageList) - messageList.scrollTop <= 1;

  const { classNames, styleOverrides } = useComponentOverrides('ChatBody');
  const { theme, mode } = useTheme();
  const styles = getChatbodyStyles(theme, mode);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [, setIsUserScrolledUp] = useState(false);
  const [otherUserMessage, setOtherUserMessage] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [firstUnreadMessageId, setFirstUnreadMessageId] = useState(null);
  const pendingFirstUnreadRef = useRef(null);
  const previousThreadOpenRef = useRef(false);
  const mainChatScrollSnapshotRef = useRef(null);
  const lastMainChatScrollTopRef = useRef(0);
  const wasAtBottomRef = useRef(true);
  const isRestoringFromThreadRef = useRef(false);
  const { RCInstance, ECOptions } = useContext(RCContext);
  const showAnnouncement = ECOptions?.showAnnouncement;
  const messages = useMessageStore((state) => state.messages);
  const offset = useMessageStore((state) => state.messagesOffset);
  const setMessagesOffset = useMessageStore((state) => state.setMessagesOffset);
  const threadMessages = useMessageStore((state) => state.threadMessages);
  const [isModalOpen, setModalOpen] = useState(false);
  const setThreadMessages = useMessageStore((state) => state.setThreadMessages);
  const upsertMessage = useMessageStore((state) => state.upsertMessage);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
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

  const { getMessagesAndRoles, fetchAndSetPermissions, permissionsRef } =
    useFetchChatData(showRoles);

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
        setThreadMessages(messages.reverse());
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

  useEffect(() => {
    const messageList = messageListRef?.current;
    if (!messageList) {
      previousThreadOpenRef.current = isThreadOpen;
      return;
    }

    if (!previousThreadOpenRef.current && isThreadOpen) {
      mainChatScrollSnapshotRef.current = lastMainChatScrollTopRef.current;
    }

    if (previousThreadOpenRef.current && !isThreadOpen) {
      const snapshot = mainChatScrollSnapshotRef.current;
      if (typeof snapshot === 'number') {
        isRestoringFromThreadRef.current = true;
        requestAnimationFrame(() => {
          const currentMessageList = messageListRef?.current;
          if (currentMessageList) {
            currentMessageList.scrollTop = Math.min(
              snapshot,
              getMaxScrollTop(currentMessageList)
            );
            lastMainChatScrollTopRef.current = currentMessageList.scrollTop;
            wasAtBottomRef.current = isAtBottom(currentMessageList);
          }

          requestAnimationFrame(() => {
            isRestoringFromThreadRef.current = false;
          });
        });
      }
    }

    previousThreadOpenRef.current = isThreadOpen;
  }, [isThreadOpen, messageListRef]);

  useEffect(() => {
    const messageList = messageListRef?.current;
    if (!messageList || isThreadOpen) {
      return;
    }

    lastMainChatScrollTopRef.current = messageList.scrollTop;
    wasAtBottomRef.current = isAtBottom(messageList);
  }, [isThreadOpen, messages, messageListRef]);

  const addMessage = useCallback(
    (message) => {
      if (message.u.username !== username) {
        const isScrolledUp =
          messageListRef?.current && !isAtBottom(messageListRef.current);
        if (isScrolledUp && !('pinned' in message) && !('starred' in message)) {
          setOtherUserMessage(true);
          // Track the first unread message (only set if not already tracking)
          if (!pendingFirstUnreadRef.current) {
            pendingFirstUnreadRef.current = message._id;
          }
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
    if (isUserAuthenticated) {
      RCInstance.addMessageListener(addMessage);
      RCInstance.addMessageDeleteListener(removeMessage);
      RCInstance.addActionTriggeredListener(onActionTriggerResponse);
      RCInstance.addUiInteractionListener(onActionTriggerResponse);
    }

    return () => {
      RCInstance.removeMessageListener(addMessage);
      RCInstance.removeMessageDeleteListener(removeMessage);
      RCInstance.removeActionTriggeredListener(onActionTriggerResponse);
      RCInstance.removeUiInteractionListener(onActionTriggerResponse);
    };
  }, [
    RCInstance,
    isUserAuthenticated,
    addMessage,
    removeMessage,
    onActionTriggerResponse,
  ]);

  useEffect(() => {
    if (isUserAuthenticated) {
      getMessagesAndRoles();
      setHasMoreMessages(true);
    } else {
      getMessagesAndRoles(anonymousMode);
    }
  }, [RCInstance, isUserAuthenticated, anonymousMode, getMessagesAndRoles]);

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchAndSetPermissions();
    } else {
      permissionsRef.current = null;
    }
  }, [isUserAuthenticated, fetchAndSetPermissions, permissionsRef]);

  // Expose clearUnreadDivider function via ref for ChatInput to call
  useEffect(() => {
    if (clearUnreadDividerRef) {
      clearUnreadDividerRef.current = () => {
        setFirstUnreadMessageId(null);
        pendingFirstUnreadRef.current = null;
      };
    }
  }, [clearUnreadDividerRef]);

  const handlePopupClick = () => {
    // Set the unread divider to show above the first unread message
    if (pendingFirstUnreadRef.current) {
      setFirstUnreadMessageId(pendingFirstUnreadRef.current);
      pendingFirstUnreadRef.current = null;
    }
    scrollToBottom();
    wasAtBottomRef.current = true;
    setIsUserScrolledUp(false);
    setOtherUserMessage(false);
    setPopupVisible(false);
  };

  const handleScroll = useCallback(async () => {
    if (messageListRef && messageListRef.current) {
      const messageList = messageListRef.current;
      const atBottom = isAtBottom(messageList);

      setScrollPosition(messageList.scrollTop);
      setIsUserScrolledUp(
        !atBottom
      );

      if (!isThreadOpen) {
        lastMainChatScrollTopRef.current = messageList.scrollTop;
        wasAtBottomRef.current = atBottom;
      }

      if (
        messageList.scrollTop === 0 &&
        !loadingOlderMessages &&
        hasMoreMessages &&
        !isRestoringFromThreadRef.current
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
                  offset,
                }
              : undefined,
            anonymousMode ? false : isChannelPrivate
          );
          if (olderMessages?.messages?.length) {
            const previousScrollHeight = messageList.scrollHeight;

            setMessages(olderMessages.messages, true);
            setMessagesOffset(offset + olderMessages.messages.length);

            requestAnimationFrame(() => {
              const newScrollHeight = messageList.scrollHeight;
              messageList.scrollTop = newScrollHeight - previousScrollHeight;
              if (!isThreadOpen) {
                lastMainChatScrollTopRef.current = messageList.scrollTop;
                wasAtBottomRef.current = isAtBottom(messageList);
              }
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

    if (messageListRef?.current && isAtBottom(messageListRef.current)) {
      setPopupVisible(false);
      setIsUserScrolledUp(false);
      setOtherUserMessage(false);
      // Clear unread divider when scrolled to bottom
      if (firstUnreadMessageId) {
        setFirstUnreadMessageId(null);
      }
      // Also clear pending unread ref
      pendingFirstUnreadRef.current = null;
    }
  }, [
    messageListRef,
    isThreadOpen,
    offset,
    setMessagesOffset,
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
    firstUnreadMessageId,
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
    if (messageListRef.current && !isThreadOpen) {
      if (wasAtBottomRef.current && !isRestoringFromThreadRef.current) {
        messageListRef.current.scrollTop = getMaxScrollTop(messageListRef.current);
      }

      lastMainChatScrollTopRef.current = messageListRef.current.scrollTop;
      wasAtBottomRef.current = isAtBottom(messageListRef.current);
    }
  }, [messages, isThreadOpen, messageListRef]);

  useEffect(() => {
    checkOverflow();
  }, [channelInfo.announcement, showAnnouncement]);
  useEffect(() => {
    const currentRef = messageListRef.current;
    if (!currentRef) {
      return undefined;
    }

    currentRef.addEventListener('scroll', handleScroll);

    return () => {
      currentRef.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, messageListRef]);

  useEffect(() => {
    if (!messageListRef.current) {
      return;
    }

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
        <Modal onClose={toggleModal}>
          <Modal.Header>
            <Modal.Title
              css={css`
                padding: 15px;
              `}
            >
              Announcement
            </Modal.Title>
            <Modal.Close onClick={toggleModal} />
          </Modal.Header>
          <Modal.Content
            css={css`
              height: 300px;
              word-wrap: break-word;
              overflow-wrap: anywhere;
              white-space: normal;
              padding: 20px;
              overflow-y: auto;
            `}
          >
            {channelInfo.announcement}
          </Modal.Content>
          <Modal.Footer>
            <Button
              type="secondary"
              onClick={toggleModal}
              css={css`
                margin: 15px;
              `}
            >
              Close
            </Button>
          </Modal.Footer>
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
            firstUnreadMessageId={firstUnreadMessageId}
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
