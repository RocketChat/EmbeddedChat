import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Input, useTheme } from '@embeddedchat/ui-elements';
import { css } from '@emotion/react';
import ReportWindowButtons from './ReportWindowButtons';
import styles from './ReportMessage.styles';

const MessageReportWindow = ({ messageId, message }) => {
  const [reportDescription, setDescription] = useState(' ');
  return (
    <ReportWindowButtons
      variant="danger"
      title="Report_this_message_question_mark"
      confirmText="Report!"
      cancelText="Cancel"
      reportDescription={reportDescription}
      messageId={messageId}
      message={message}
    >
      <Box css={styles.conatiner}>
        <Input
          textArea
          placeholder="Why do you want to report this message?"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        {reportDescription === '' ? (
          <Box
            css={css`
              color: red;
              margin-top: 0.5rem;
              font-size: 0.7rem;
            `}
          >
            You need to write something!
          </Box>
        ) : null}
      </Box>
    </ReportWindowButtons>
  );
};

export default MessageReportWindow;
MessageReportWindow.propTypes = {
  messageId: PropTypes.string.isRequired,
};
