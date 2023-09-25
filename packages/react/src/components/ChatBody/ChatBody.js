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

const ChatBody = ({ height, anonymousMode, showRoles }) => {
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
    [RCInstance, ECOptions?.enableThreads, isUserAuthenticated, anonymousMode]
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
    if (isUserAuthenticated) {
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
  }, [isThreadOpen, isUserAuthenticated, RCInstance, threadMainMessage]);

  useEffect(() => {
    if (isThreadOpen && ECOptions.enableThreads) {
      getThreadMessages();
    }
  }, [getThreadMessages, isThreadOpen, ECOptions?.enableThreads]);

  const addMessage = useCallback(
    (message) => {
      upsertMessage(message, ECOptions?.enableThreads);
    },
    [upsertMessage, ECOptions?.enableThreads]
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

  return (
    <Box
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
  );
};

export default ChatBody;

ChatBody.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anonymousMode: PropTypes.bool,
  showRoles: PropTypes.bool,
};
