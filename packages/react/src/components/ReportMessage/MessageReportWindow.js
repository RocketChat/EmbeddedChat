import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReportWindowButtons from './ReportWindowButtons';
import { useMessageStore } from '../../store';
import { Box } from '../Box';
import { ModalBackdrop } from '../Modal';
import { Input } from '../Input';

const MessageReportWindow = ({ messageId }) => {
  const [reportDescription, setDescription] = useState('');
  const messages = useMessageStore((state) => state.messages);
  const messageText = messages.filter((message) => message._id === messageId)[0]
    ?.msg;
  return (
    <ModalBackdrop>
      <ReportWindowButtons
        variant="danger"
        title="Report_this_message_question_mark"
        confirmText="Report!"
        cancelText="Cancel"
        reportDescription={reportDescription}
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
            placeholder="Why do you want to report this message?"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </Box>
      </ReportWindowButtons>
    </ModalBackdrop>
  );
};

export default MessageReportWindow;
MessageReportWindow.propTypes = {
  messageId: PropTypes.string.isRequired,
};
