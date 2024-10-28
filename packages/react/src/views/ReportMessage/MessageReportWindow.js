import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Input } from '@embeddedchat/ui-elements';
import ReportWindowButtons from './ReportWindowButtons';
import styles from './ReportMessage.styles';

const MessageReportWindow = ({ messageId }) => {
  const [reportDescription, setDescription] = useState('');
  return (
    <ReportWindowButtons
      variant="danger"
      title="Report_this_message_question_mark"
      confirmText="Report!"
      cancelText="Cancel"
      reportDescription={reportDescription}
      messageId={messageId}
    >
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
