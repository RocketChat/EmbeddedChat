import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { isSameDay } from 'date-fns';
import { useMessageStore, useUserStore } from '../../store';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import { Message } from '../Message';
import { Box } from '../../components/Box';
import { Icon } from '../../components/Icon';
import isMessageLastSequential from '../../lib/isMessageLastSequential';

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
      <Box
        css={css`
          margin: auto;
        `}
      >
        <Box
          css={css`
            text-align: center;
          `}
        >
          <Icon name={iconType} size="2rem" />
        </Box>
        <Box
          css={css`
            text-align: center;
          `}
        >
          No {msgType}
        </Box>
      </Box>
    );
  }
  return (
    <>
      {messages &&
        messages.map((msg, index, arr) => {
          const prev = arr[index + 1];
          const next = arr[index - 1];
          const newDay = isMessageNewDay(msg, prev);
          const sequential = isMessageSequential(msg, prev, 300);
          const lastSequential =
            sequential && isMessageLastSequential(msg, next);

          return (
            msg && (
              <Message
                key={msg._id}
                message={msg}
                newDay={newDay}
                sequential={sequential}
                lastSequential={lastSequential}
                type="default"
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
