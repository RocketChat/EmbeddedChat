/* eslint-disable no-shadow */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import RCContext from '../../context/RCInstance';
import { useMessageStore, useUserStore, useChannelStore } from '../../store';
import MessageList from '../MessageList';
import TotpModal from '../TotpModal/TwoFactorTotpModal';
import { Box } from '../Box';
import { useRCAuth } from '../../hooks/useRCAuth';
import LoginForm from '../auth/LoginForm';
import ThreadMessageList from '../Thread/ThreadMessageList';
import ModalBlock from '../uiKit/blocks/ModalBlock';
import useComponentOverrides from '../../theme/useComponentOverrides';
import RecentMessageButton from './RecentMessageButton';
import useFetchChatData from '../../hooks/useFetchChatData';

const ChatBody = ({
  height,
  anonymousMode,
  showRoles,
  scrollToBottom,
  messageListRef,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ChatBody');
  const ChatBodyCss = css`
    word-break: break-all;
    overflow: scroll;
    overflow: auto;
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
    height: 100vh;
    max-height: 600px;
    position: relative;
    ::-webkit-scrollbar {
      width: 7px;
      height: 7.7px;
    }
    ::-webkit-scrollbar-thumb {
      background: #8d8d8d;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    ::-webkit-scrollbar-button {
      display: none;
    }
  `;

  const [scrollPosition, setScrollPosition] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [, setIsUserScrolledUp] = useState(false);
  const [otherUserMessage, setOtherUserMessage] = useState(false);

  const { RCInstance, ECOptions } = useContext(RCContext);
  const messages = useMessageStore((state) => state.messages);
  const threadMessages = useMessageStore((state) => state.threadMessages);

  const setThreadMessages = useMessageStore((state) => state.setThreadMessages);
  const upsertMessage = useMessageStore((state) => state.upsertMessage);
  const removeMessage = useMessageStore((state) => state.removeMessage);
  const isChannelPrivate = useChannelStore((state) => state.isChannelPrivate);

  const [isThreadOpen, threadMainMessage] = useMessageStore((state) => [
    state.isThreadOpen,
    state.threadMainMessage,
  ]);

  const { handleLogin } = useRCAuth();

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const username = useUserStore((state) => state.username);

  const getMessagesAndRoles = useFetchChatData(showRoles);

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
        const isScrolledUp = messageListRef.current.scrollTop !== 0;
        if (isScrolledUp) {
          setOtherUserMessage(true);
        }
      }
      upsertMessage(message, ECOptions?.enableThreads);
    },
    [upsertMessage, ECOptions?.enableThreads, username, messageListRef]
  );

  const [isModalOpen, setModalOpen] = useState();
  const [viewData, setViewData] = useState();

  const onActionTriggerResponse = useCallback((data) => {
    if (data?.type === 'modal.open' || data?.type === 'modal.update') {
      setViewData(data.view);
      setModalOpen(true);
    }
  }, []);

  const onModalClose = () => {
    setModalOpen(false);
    setViewData(null);
  };

  const onModalSubmit = useCallback(async (data) => {
    console.log(data);
    // const { actionId, value, blockId, appId, viewId } = data;
    // await RCInstance?.triggerBlockAction({
    //   rid: RCInstance.rid,
    //   actionId,
    //   value,
    //   blockId,
    //   appId,
    //   viewId,
    // });
  }, []);

  // const onModalSubmit = useCallback(async (data, value) => {
  //   console.log(data);
  //   // const { actionId, value, blockId, appId, viewId } = data;
  //   // await RCInstance?.triggerBlockAction({
  //   //   rid: RCInstance.rid,
  //   //   actionId,
  //   //   value,
  //   //   blockId,
  //   //   appId,
  //   //   viewId,
  //   // });
  // }, []);

  useEffect(() => {
    RCInstance.auth.onAuthChange((user) => {
      if (user) {
        RCInstance.addMessageListener(addMessage);
        RCInstance.addMessageDeleteListener(removeMessage);
        RCInstance.addActionTriggeredListener(onActionTriggerResponse);
        RCInstance.addUiInteractionListener(onActionTriggerResponse);
        getMessagesAndRoles();
      } else {
        getMessagesAndRoles(anonymousMode);
      }
    });

    return () => {
      RCInstance.close();
      RCInstance.removeMessageListener(addMessage);
      RCInstance.removeMessageDeleteListener(removeMessage);
      RCInstance.removeActionTriggeredListener(onActionTriggerResponse);
      RCInstance.removeUiInteractionListener(onActionTriggerResponse);
    };
  }, [
    RCInstance,
    getMessagesAndRoles,
    addMessage,
    removeMessage,
    onActionTriggerResponse,
    anonymousMode,
  ]);

  const handlePopupClick = () => {
    scrollToBottom();
    setIsUserScrolledUp(false);
    setOtherUserMessage(false);
    setPopupVisible(false);
  };

  const handleScroll = () => {
    setScrollPosition(messageListRef.current.scrollTop);

    setIsUserScrolledUp(
      messageListRef.current.scrollTop + messageListRef.current.clientHeight <
        messageListRef.current.scrollHeight
    );

    const isAtBottom = messageListRef.current.scrollTop === 0;
    if (isAtBottom) {
      setPopupVisible(false);
      setIsUserScrolledUp(false);
      setOtherUserMessage(false);
    }
  };

  const showNewMessagesPopup = () => {
    setPopupVisible(true);
  };

  useEffect(() => {
    messageListRef.current.addEventListener('scroll', handleScroll);

    return () => {
      messageListRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [messageListRef]);

  useEffect(() => {
    const isScrolledUp =
      scrollPosition + messageListRef.current.clientHeight <
      messageListRef.current.scrollHeight;

    if (isScrolledUp && otherUserMessage) {
      showNewMessagesPopup();
    }
  }, [scrollPosition, otherUserMessage]);

  return (
    <>
      <Box
        ref={messageListRef}
        css={ChatBodyCss}
        style={{
          borderLeft: '1px solid #b1b1b1',
          borderRight: '1px solid #b1b1b1',
          paddingTop: '70px',
          ...styleOverrides,
        }}
        className={`ec-chat-body ${classNames}`}
        height={height}
      >
        {isThreadOpen ? (
          <ThreadMessageList
            threadMainMessage={threadMainMessage}
            threadMessages={threadMessages}
          />
        ) : (
          <MessageList messages={messages} />
        )}
        <TotpModal handleLogin={handleLogin} />
        <LoginForm />
        {isModalOpen && (
          <ModalBlock
            appId={viewData.appId}
            onClose={onModalClose}
            onCancel={onModalClose}
            onSubmit={onModalSubmit}
            view={viewData}
          />
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
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anonymousMode: PropTypes.bool,
  showRoles: PropTypes.bool,
};
