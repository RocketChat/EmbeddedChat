import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ReportWindowButtons from './ReportWindowButtons';
import { useMessageStore } from '../../store';
import { Box } from '../../components/Box';
import { Input } from '../../components/Input';
import styles from './ReportMessage.styles';

const MessageReportWindow = ({ messageId }) => {
  const [reportDescription, setDescription] = useState('');
  const messages = useMessageStore((state) => state.messages);
  const messageText = messages.filter((message) => message._id === messageId)[0]
    ?.msg;
  return (
    <ReportWindowButtons
      variant="danger"
      title="Report_this_message_question_mark"
      confirmText="Report!"
      cancelText="Cancel"
      reportDescription={reportDescription}
      messageId={messageId}
    >
      <Box>{JSON.stringify(messageText)}</Box>
      <Box css={styles.conatiner}>
        <Input
          textArea
          placeholder="Why do you want to report this message?"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </Box>
    </ReportWindowButtons>
  );
};

export default MessageReportWindow;
MessageReportWindow.propTypes = {
  messageId: PropTypes.string.isRequired,
};
