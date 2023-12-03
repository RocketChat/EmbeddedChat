import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DeleteWindowButtons from './DeleteWindowButtons';
import { useMessageStore } from '../../store';
import { Box } from '../Box';
import { ModalBackdrop } from '../Modal';
import { Input } from '../Input';

const MessageDeleteWindow = ({ messageId }) => {
  const [deleteDescription, setDescription] = useState('');
  const messages = useMessageStore((state) => state.messages);
  const messageText = messages.filter((message) => message._id === messageId)[0]
    ?.msg;
  return (
    <ModalBackdrop>
      <DeleteWindowButtons
        variant="danger"
        title="Delete_this_message_question_mark"
        confirmText="Delete!"
        cancelText="Cancel"
        deleteDescription={deleteDescription}
        messageId={messageId}
      >
        <Box>{JSON.stringify(messageText)}</Box>
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '0.125rem',
          }}
        >
          <Input
            textArea
            style={{ width: '90%' }}
            placeholder="Why do you want to delete this message?"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Box>
      </DeleteWindowButtons>
    </ModalBackdrop>
  );
};

export default MessageDeleteWindow;
MessageDeleteWindow.propTypes = {
  messageId: PropTypes.string.isRequired,
};
