/* eslint-disable no-shadow */
import { Box } from '@rocket.chat/fuselage';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ChatBody.module.css';
import RCContext from '../../context/RCInstance';
import { useMessageStore, useUserStore } from '../../store';
import MessageList from '../MessageList';
import TotpModal from '../TotpModal/TwoFactorTotpModal';
import { useRCAuth4Google } from '../../hooks/useRCAuth4Google';
import { useRCAuth } from '../../hooks/useRCAuth';
import { useRCAuth4Facebook } from '../../hooks/useRCAuth4Facebook';
import LoginForm from '../auth/LoginForm';
import useAttachmentWindowStore from '../../store/attachmentwindow';

const ChatBody = ({
  height,
  anonymousMode,
  showRoles,
  GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID,
}) => {
  const { RCInstance } = useContext(RCContext);
  const messages = useMessageStore((state) => state.messages);

  const toggle = useAttachmentWindowStore((state) => state.toggle);
  const setData = useAttachmentWindowStore((state) => state.setData);

  const setMessages = useMessageStore((state) => state.setMessages);
  const upsertMessage = useMessageStore((state) => state.upsertMessage);
  const removeMessage = useMessageStore((state) => state.removeMessage);
  const setFilter = useMessageStore((state) => state.setFilter);
  const setRoles = useUserStore((state) => state.setRoles);

  const { handleGoogleLogin } = useRCAuth4Google(GOOGLE_CLIENT_ID);
  const { handleFacebookLogin } = useRCAuth4Facebook();
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
        const { messages } = await RCInstance.getMessages(anonymousMode);
        setMessages(messages);
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
    [RCInstance]
  );

  const handleGoBack = async () => {
    if (isUserAuthenticated) {
      getMessagesAndRoles();
    } else {
      getMessagesAndRoles(anonymousMode);
    }
    setFilter(false);
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      RCInstance.connect().then(() => {
        RCInstance.addMessageListener(upsertMessage);
        RCInstance.addMessageDeleteListener(removeMessage);
      });
      getMessagesAndRoles();
    } else {
      getMessagesAndRoles(anonymousMode);
    }

    return () => {
      RCInstance.close();
      RCInstance.removeMessageListener(upsertMessage);
      RCInstance.removeMessageDeleteListener(removeMessage);
    };
  }, [isUserAuthenticated, getMessagesAndRoles, upsertMessage, removeMessage]);

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
      style={{
        borderLeft: '1px solid #b1b1b1',
        borderRight: '1px solid #b1b1b1',
        paddingTop: '70px',
      }}
      onDragOver={(e) => handleDrag(e)}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={styles.container}
      height={height}
    >
      {onDrag ? (
        <Box
          onDrop={(e) => handleDragDrop(e)}
          className={styles.drag_component}
        >
          Drop to upload file
        </Box>
      ) : null}
      <MessageList messages={messages} handleGoBack={handleGoBack} />
      <TotpModal
        handleGoogleLogin={handleGoogleLogin}
        handleLogin={handleLogin}
        handleFacebookLogin={handleFacebookLogin}
      />
      <LoginForm FACEBOOK_APP_ID={FACEBOOK_APP_ID} />
    </Box>
  );
};

export default ChatBody;

ChatBody.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anonymousMode: PropTypes.bool,
  showRoles: PropTypes.bool,
  GOOGLE_CLIENT_ID: PropTypes.string,
  FACEBOOK_APP_ID: PropTypes.string,
};
