import React, { useState } from 'react';
import { ModalBackdrop, TextAreaInput, Box } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';
import ReportWindowButtons from './ReportWindowButtons';
import classes from './MessageReporter.module.css';
import { useMessageStore } from '../../store';

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
        <Box>
          <Box>{JSON.stringify(messageText)}</Box>
          <TextAreaInput
            className={classes.textArea}
            TextAreaInput
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
