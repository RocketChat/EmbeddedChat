import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Input } from '@embeddedchat/ui-elements';
import ReportWindowButtons from './ReportWindowButtons';
import { useMessageStore } from '../../store';
import styles from './ReportMessage.styles';
import { Markdown } from '../Markdown';

const MessageReportWindow = ({ messageId }) => {
  const [reportDescription, setDescription] = useState('');
  const messages = useMessageStore((state) => state.messages);
  const message = messages.filter((message) => message._id === messageId)[0];
  return (
    <ReportWindowButtons
      variant="danger"
      title="Report_this_message_question_mark"
      confirmText="Report!"
      cancelText="Cancel"
      reportDescription={reportDescription}
      messageId={messageId}
    >
      <Box>
        <Markdown body={message} isReaction={false} />
      </Box>
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
