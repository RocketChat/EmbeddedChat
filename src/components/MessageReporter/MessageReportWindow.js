import React from 'react';
import { ModalBackdrop, TextAreaInput, Box } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';
import ReportBox from './ReportBox';
import classes from './MessageReporter.module.css';
import { useMessageStore } from '../../store';

const MessageReportWindow = ({ messageId }) => {
  const messages = useMessageStore((state) => state.messages);

  const messageText = messages.filter((message) => message._id === messageId)[0]
    ?.msg;
  return (
    <ModalBackdrop>
      <ReportBox
        variant="danger"
        title="Report_this_message_question_mark"
        onConfirm={NaN}
        confirmText="Report_exclamation_mark"
      >
        <Box>
          <Box>{JSON.stringify(messageText)}</Box>
          <TextAreaInput
            className={classes.textArea}
            TextAreaInput
            placeholder="Why do you want to report this message?"
          />
        </Box>
      </ReportBox>
    </ModalBackdrop>
  );
};

export default MessageReportWindow;
MessageReportWindow.propTypes = {
  messageId: PropTypes.string.isRequired,
};
