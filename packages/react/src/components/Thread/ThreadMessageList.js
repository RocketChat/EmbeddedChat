import React from 'react';
import PropTypes from 'prop-types';
import { isSameDay } from 'date-fns';
import { useMessageStore, useUserStore } from '../../store';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import { Message } from '../Message';

const ThreadMessageList = ({ threadMessages, threadMainMessage }) => {
  const showAvatar = useUserStore((state) => state.showAvatar);
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);
  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));
  return (
    <>
      {threadMessages.concat(threadMainMessage).map((msg, index, arr) => {
        const prev = arr[index + 1];
        const newDay = isMessageNewDay(msg, prev);
        const sequential = isMessageSequential(msg, prev, 300);

        return (
          msg && (
            <Message
              key={msg._id}
              message={msg}
              newDay={newDay}
              sequential={sequential}
              variant="thread"
              showAvatar={showAvatar}
            />
          )
        );
      })}
      {showReportMessage && <MessageReportWindow messageId={messageToReport} />}
    </>
  );
};

export default ThreadMessageList;

ThreadMessageList.propTypes = {
  threadMessages: PropTypes.arrayOf(PropTypes.object),
  threadMainMessage: PropTypes.object,
};
