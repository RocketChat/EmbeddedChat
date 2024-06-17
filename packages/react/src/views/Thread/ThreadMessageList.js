import React from 'react';
import PropTypes from 'prop-types';
import { isSameDay } from 'date-fns';
import { useMessageStore } from '../../store';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import isMessageLastSequential from '../../lib/isMessageLastSequential';
import { Message } from '../Message';

const ThreadMessageList = ({ threadMessages, threadMainMessage }) => {
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));
  return (
    <>
      {threadMessages?.concat(threadMainMessage).map((msg, index, arr) => {
        const prev = arr[index + 1];
        const next = arr[index - 1];
        const newDay = isMessageNewDay(msg, prev);
        const sequential = isMessageSequential(msg, prev, 300);
        const lastSequential = sequential && isMessageLastSequential(msg, next);

        return (
          msg && (
            <Message
              key={msg._id}
              message={msg}
              newDay={newDay}
              sequential={sequential}
              lastSequential={lastSequential}
              type="thread"
              showAvatar
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
