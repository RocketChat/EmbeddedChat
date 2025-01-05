import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { isSameDay } from 'date-fns';
import { Box, Icon, Throbber, useTheme } from '@embeddedchat/ui-elements';
import { useMessageStore } from '../../store';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import { Message } from '../Message';
import isMessageLastSequential from '../../lib/isMessageLastSequential';
import { MessageBody } from '../Message/MessageBody';

const MessageList = ({
  messages,
  loadingOlderMessages,
  isUserAuthenticated,
  hasMoreMessages,
}) => {
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);
  const isMessageLoaded = useMessageStore((state) => state.isMessageLoaded);
  const { theme } = useTheme();

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

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
          {!hasMoreMessages && isUserAuthenticated && (
            <MessageBody
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 16px',
                zIndex: 10,
              }}
            >
              Start of conversation
            </MessageBody>
          )}
          {loadingOlderMessages && isUserAuthenticated && (
            <Box
              css={css`
                margin: auto;
                display: flex;
                justify-content: center;
                aling-items: center;
              `}
            >
              <Throbber />
            </Box>
          )}
          {messages
            .slice()
            .reverse()
            .map((msg, index, arr) => {
              const prev = arr[index - 1];
              const next = arr[index + 1];

              if (!msg) return null;
              const newDay = isMessageNewDay(msg, prev);
              const sequential = isMessageSequential(msg, prev, 300);
              const lastSequential =
                sequential && isMessageLastSequential(msg, next);

              return (
                <Message
                  key={msg._id}
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
