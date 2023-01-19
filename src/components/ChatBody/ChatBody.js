/* eslint-disable no-shadow */
import { Box } from '@rocket.chat/fuselage';
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ChatBody.module.css';
import RCContext from '../../context/RCInstance';
import { useMessageStore, useUserStore } from '../../store';
import MessageList from '../MessageList';

const ChatBody = ({ height, anonymousMode }) => {
  const { RCInstance } = useContext(RCContext);
  const messages = useMessageStore((state) => state.messages);

  const setMessages = useMessageStore((state) => state.setMessages);
  const setFilter = useMessageStore((state) => state.setFilter);

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const getMessages = async (anonymousMode) => {
    const { messages } = await RCInstance.getMessages(anonymousMode);
    setMessages(messages);
  };

  const handleGoBack = async () => {
    if (isUserAuthenticated) {
      getMessages();
    } else {
      getMessages(anonymousMode);
    }
    setFilter(false);
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      RCInstance.realtime(() => getMessages());
      getMessages();
    } else {
      getMessages(anonymousMode);
    }

    return () => RCInstance.close();
  }, [isUserAuthenticated]);

  return (
    <Box
      style={{
        borderLeft: '1px solid #b1b1b1',
        borderRight: '1px solid #b1b1b1',
      }}
      className={styles.container}
      height={height}
    >
      <MessageList messages={messages} handleGoBack={handleGoBack} />
    </Box>
  );
};

export default ChatBody;

ChatBody.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  anonymousMode: PropTypes.bool,
};
