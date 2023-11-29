import React from 'react';
import PropTypes from 'prop-types';
import DeleteWindowButtons from './DeleteWindowButtons';
import { useMessageStore } from '../../store';
import { Box } from '../Box';

const MessageDeleteWindow = ({ messageId }) => {
  const messages = useMessageStore((state) => state.messages);
  const messageText = messages.find(
    (message) => message._id === messageId
  )?.msg;

  return (
    <DeleteWindowButtons messageId={messageId}>
      <Box>{JSON.stringify(messageText)}</Box>
    </DeleteWindowButtons>
  );
};

MessageDeleteWindow.propTypes = {
  messageId: PropTypes.string.isRequired,
};

export default MessageDeleteWindow;
