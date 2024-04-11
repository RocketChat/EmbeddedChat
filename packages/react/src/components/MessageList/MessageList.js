import React from 'react';
import PropTypes from 'prop-types';
import { isSameDay } from 'date-fns';
import { useMessageStore, useUserStore } from '../../store';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import { Message } from '../Message';

import { Icon } from '../Icon';

const MessageList = ({ messages }) => {
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);
  const showAvatar = useUserStore((state) => state.showAvatar);
  const headerTitle = useMessageStore((state) => state.headerTitle);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));
  let iconType = 'thread';
  let msgType = headerTitle;
  if (msgType === 'Pinned Messages') {
    iconType = 'pin';
  } else if (msgType === 'Starred Messages') {
    iconType = 'star';
  } else {
    msgType = 'messages';
  }
  if (messages.length === 0) {
    return (
      <div style={{ margin: 'auto' }}>
        <div style={{ textAlign: 'center' }}>
          <Icon name={iconType} size="2rem" />
        </div>
        <div style={{ textAlign: 'center' }}>No {msgType}</div>
      </div>
    );
  }
  return (
    <>
      {messages &&
        messages.map((msg, index, arr) => {
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
                variant="default"
                showAvatar={showAvatar}
              />
            )
          );
        })}

      {showReportMessage && <MessageReportWindow messageId={messageToReport} />}
    </>
  );
};

export default MessageList;

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape),
};
