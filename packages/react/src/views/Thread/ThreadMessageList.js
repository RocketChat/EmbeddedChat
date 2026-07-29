import React from 'react';
import PropTypes from 'prop-types';
import { isSameDay } from 'date-fns';
import { useMessageStore } from '../../store';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import isMessageLastSequential from '../../lib/isMessageLastSequential';
import { Message } from '../Message';
import LocalAIMessage from '../LocalAIMessage';

const ThreadMessageList = ({
  threadMessages,
  threadMainMessage,
  catchUps = [],
  onDismissCatchUp,
}) => {
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  const sortedMessages = [...(threadMessages || []), threadMainMessage]
    .filter(Boolean)
    .sort((a, b) => new Date(a.ts) - new Date(b.ts));

  return (
    <>
      {sortedMessages.map((msg, index, arr) => {
        const prev = arr[index - 1];
        const next = arr[index + 1];
        const newDay = isMessageNewDay(msg, prev);
        const sequential = isMessageSequential(msg, prev, 300);
        const lastSequential = sequential && isMessageLastSequential(msg, next);

        return (
          <Message
            key={msg._id}
            message={msg}
            newDay={newDay}
            sequential={sequential}
            lastSequential={lastSequential}
            type="thread"
            showAvatar
          />
        );
      })}
      {catchUps.map((catchUp) => (
        <LocalAIMessage
          key={catchUp.id}
          catchUp={catchUp}
          onDismiss={onDismissCatchUp}
        />
      ))}
      {showReportMessage && <MessageReportWindow messageId={messageToReport} />}
    </>
  );
};

export default ThreadMessageList;

ThreadMessageList.propTypes = {
  threadMessages: PropTypes.arrayOf(PropTypes.object),
  threadMainMessage: PropTypes.object,
  catchUps: PropTypes.arrayOf(PropTypes.object),
  onDismissCatchUp: PropTypes.func,
};
