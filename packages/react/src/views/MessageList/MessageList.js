import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { isSameDay } from 'date-fns';
import { Box, Icon } from '@embeddedchat/ui-elements';
import { useMessageStore } from '../../store';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import { Message } from '../Message';
import isMessageLastSequential from '../../lib/isMessageLastSequential';

const MessageList = ({ messages }) => {
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);
  const isMessageLoaded = useMessageStore((state) => state.isMessageLoaded);

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));
  const messageRefs = useRef({});
  const { scrollToMessageId } = useMessageStore((state) => ({
    scrollToMessageId: state.scrollToMessageId,
  }));

  useEffect(() => {
    if (scrollToMessageId && messageRefs.current[scrollToMessageId]) {
      messageRefs.current[scrollToMessageId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [scrollToMessageId]);
  return (
    <>
      {messages.length === 0 ? (
        <Box
          css={css`
            text-align: center;
            margin: auto;
          `}
        >
          <Icon name="thread" size="2rem" />
          <Box>
            {isMessageLoaded
              ? 'No messages'
              : 'Ready to chat? Login now to join the fun.'}
          </Box>
        </Box>
      ) : (
        <>
          {messages.map((msg, index, arr) => {
            const prev = arr[index + 1];
            const next = arr[index - 1];

            if (!msg) return null;
            const newDay = isMessageNewDay(msg, prev);
            const sequential = isMessageSequential(msg, prev, 300);
            const lastSequential =
              sequential && isMessageLastSequential(msg, next);

            return (
              <Message
                key={msg._id}
                ref={(el) => {
                  messageRefs.current[msg._id] = el;
                }}
                message={msg}
                newDay={newDay}
                sequential={sequential}
                lastSequential={lastSequential}
                type="default"
                showAvatar
              />
            );
          })}
          {showReportMessage && (
            <MessageReportWindow messageId={messageToReport} />
          )}
        </>
      )}
    </>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape),
};

export default MessageList;
