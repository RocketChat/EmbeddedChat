/* eslint-disable no-shadow */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import RCContext from '../../context/RCInstance';
import { useMessageStore, useUserStore } from '../../store';
import MessageList from '../MessageList';
import TotpModal from '../TotpModal/TwoFactorTotpModal';
import { Box } from '../Box';
import { useRCAuth } from '../../hooks/useRCAuth';
import LoginForm from '../auth/LoginForm';
import useAttachmentWindowStore from '../../store/attachmentwindow';
import ThreadMessageList from '../Thread/ThreadMessageList';
import ModalBlock from '../uiKit/blocks/ModalBlock';
import useComponentOverrides from '../../theme/useComponentOverrides';
import RecentMessageButton from './RecentMessageButton';

const ChatBody = ({ height, anonymousMode, showRoles, scrollToBottom, messageListRef }) => {
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
  const DragComponentCss = css`
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    z-index: 50;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    font-weight: 900;
    font-size: xxx-large;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `;

  const { RCInstance, ECOptions } = useContext(RCContext);
  const messages = useMessageStore((state) => state.messages);
  const threadMessages = useMessageStore((state) => state.threadMessages);

  const toggle = useAttachmentWindowStore((state) => state.toggle);
  const setData = useAttachmentWindowStore((state) => state.setData);

  const setMessages = useMessageStore((state) => state.setMessages);
  const setThreadMessages = useMessageStore((state) => state.setThreadMessages);
  const upsertMessage = useMessageStore((state) => state.upsertMessage);
  const removeMessage = useMessageStore((state) => state.removeMessage);
  const setFilter = useMessageStore((state) => state.setFilter);
  const setRoles = useUserStore((state) => state.setRoles);

  const [isThreadOpen, threadMainMessage] = useMessageStore((state) => [
    state.isThreadOpen,
    state.threadMainMessage,
  ]);

  const { handleLogin } = useRCAuth();

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const username = useUserStore(
    (state) => state.username
  );

  const getMessagesAndRoles = useCallback(
    async (anonymousMode) => {
      try {
        if (!isUserAuthenticated && !anonymousMode) {
          return;
        }
        const { messages } = await RCInstance.getMessages(
          anonymousMode,
          ECOptions?.enableThreads
            ? {
              query: {
                tmid: {
                  $exists: false,
                },
              },
            }
            : undefined
        );
        if (messages) {
          setMessages(messages.filter((message) => message._hidden !== true));
        }
        if (!isUserAuthenticated) {
          // fetch roles only when user is authenticated
          return;
        }
        if (showRoles) {
          const { roles } = await RCInstance.getChannelRoles();
          // convert roles array from api into object for better search
          const rolesObj = roles.reduce(
            (obj, item) => Object.assign(obj, { [item.u.username]: item }),
            {}
          );
          setRoles(rolesObj);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [
      isUserAuthenticated,
      RCInstance,
      ECOptions?.enableThreads,
      showRoles,
      setMessages,
      setRoles,
    ]
  );

  const handleGoBack = async () => {
    if (isUserAuthenticated) {
      getMessagesAndRoles();
    } else {
      getMessagesAndRoles(anonymousMode);
    }
    setFilter(false);
  };

  const getThreadMessages = useCallback(async () => {
    if (isUserAuthenticated && threadMainMessage?._id) {
      try {
        if (!isUserAuthenticated && !anonymousMode) {
          return;
        }
        const { messages } = await RCInstance.getThreadMessages(
          threadMainMessage._id
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
  ]);

  useEffect(() => {
    if (isThreadOpen && ECOptions.enableThreads) {
      getThreadMessages();
    }
  }, [getThreadMessages, isThreadOpen, ECOptions?.enableThreads]);

  const addMessage = useCallback(
    (message) => {
      if (message.u.username !== username) {
        const isScrolledUp =
          messageListRef.current.scrollTop + messageListRef.current.clientHeight <
          messageListRef.current.scrollHeight;

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

  const onModalSubmit = useCallback(async (data, value) => {
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
  });

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

  const [onDrag, setOnDrag] = useState(false);
  const [leaveCount, setLeaveCount] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setOnDrag(true);
  };
  const handleDragLeave = () => {
    if (leaveCount % 2 === 1) {
      setOnDrag(false);
      setLeaveCount(leaveCount + 1);
    } else {
      setLeaveCount(leaveCount + 1);
    }
  };

  const handleDragDrop = (e) => {
    e.preventDefault();
    setOnDrag(false);
    setLeaveCount(0);

    toggle();
    setData(e.dataTransfer.files[0]);
  };

  const [scrollPosition, setScrollPosition] = useState(0);
  const [popupVisible, setPopupVisible] = useState(false);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [otherUserMessage, setOtherUserMessage] = useState(false);

  const handlePopupClick = () => {
    // Trigger a function to scroll the chat-body to the bottom


    // Hide the popup after clicking on it

    scrollToBottom();
    setIsUserScrolledUp(false);
    setOtherUserMessage(false);
    setPopupVisible(false);
    // setIsButtonClicked(true);
  };


  const handleScroll = () => {
    // Update the scroll position when the user scrolls
    setScrollPosition(messageListRef.current.scrollTop);

    // Check if the user has scrolled up
    setIsUserScrolledUp(
      messageListRef.current.scrollTop + messageListRef.current.clientHeight <
      messageListRef.current.scrollHeight
    );
    // console.log(messageListRef.current.scrollTop + messageListRef.current.clientHeight <
    //   messageListRef.current.scrollHeight);
    // console.log(isUserScrolledUp);

    // Reset otherUserMessage when the user scrolls to the bottom
    console.log(messageListRef.current.scrollTop + messageListRef.current.clientHeight >= messageListRef.current.scrollHeight);

    // Check if the user has scrolled to the bottom
    const isAtBottom =
      messageListRef.current.scrollTop + messageListRef.current.clientHeight >=
      messageListRef.current.scrollHeight;

    // Hide the popup when the user scrolls to the bottom manually
    if (isAtBottom) {
      setPopupVisible(false);
      setIsUserScrolledUp(false);
      setOtherUserMessage(false);
    }
  };

  const showNewMessagesPopup = () => {
    // Implement the logic to show a popup notifying about new messages

    setPopupVisible(true);
  };


  useEffect(() => {
    // Attach the scroll event listener
    messageListRef.current.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      messageListRef.current.removeEventListener('scroll', handleScroll);
    };
  }, [messageListRef]);

  // useEffect(() => {

  // }, [messages])

  useEffect(() => {
    // Check if the user has scrolled up (not at the bottom)
    const isScrolledUp =
      scrollPosition + messageListRef.current.clientHeight <
      messageListRef.current.scrollHeight;
    console.log(isScrolledUp);

    // Check if there are new messages from other users

    // const hasNewMessages =
    //   messages.some((message) => message.fromCurrentUser === false) &&
    //   newMessagesAvailable;

    // const hasNewMessages = (messages.some((message) => message.u.username !== username));
    console.log(username);
    // console.log(hasNewMessages);
    console.log(messages);

    // if (hasNewMessages) {
    //   setOtherUserMessage(hasNewMessages);
    // }
    // console.log(otherUserMessage);

    if (isScrolledUp && otherUserMessage) {
      // Show a popup to inform the user about new messages

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
        onDragOver={(e) => handleDrag(e)}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`ec-chat-body ${classNames}`}
        height={height}
      >
        {onDrag ? (
          <Box onDrop={(e) => handleDragDrop(e)} className={DragComponentCss}>
            Drop to upload file
          </Box>
        ) : null}
        {isThreadOpen ? (
          <ThreadMessageList
            threadMainMessage={threadMainMessage}
            threadMessages={threadMessages}
          />
        ) : (
          <MessageList messages={messages} handleGoBack={handleGoBack} />
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
      {(popupVisible && otherUserMessage) && (
        <RecentMessageButton
          visible={true}
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
