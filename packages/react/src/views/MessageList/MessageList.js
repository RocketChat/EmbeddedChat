import React, { useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { isSameDay } from 'date-fns';
import { Box, Icon, Throbber } from '@embeddedchat/ui-elements';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMessageStore } from '../../store';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import { Message } from '../Message';
import isMessageLastSequential from '../../lib/isMessageLastSequential';
import { MessageBody } from '../Message/MessageBody';
import { MessageNavigationProvider } from '../../context/MessageNavigationContext';
import { MessageDivider } from '../Message/MessageDivider';

const MessageList = ({
  messagesS,
  loadingOlderMessages,
  isUserAuthenticated,
  hasMoreMessages,
  messageContainerRef,
  onRegisterJump,
  firstUnreadMessageId,
}) => {
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);
  const isMessageLoaded = useMessageStore((state) => state.isMessageLoaded);
  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  const filteredMessages = messagesS.filter((msg) => !msg.tmid);
  const reversedMessages = filteredMessages.slice().reverse();
  const orderedMessages = useMemo(
    () => reversedMessages.filter((m) => !m.tmid),
    [reversedMessages]
  );

  const messages = useMessageStore((state) => state.messages);

  const rowVirtualizer = useVirtualizer({
    count: orderedMessages.length,
    getScrollElement: () => messageContainerRef.current,
    getItemKey: (index) => orderedMessages[index]?._id ?? index,
    overscan: 10,
    estimateSize: () => 50,
    measureElement: (element) => element.offsetHeight,
    // onScroll: ({ scrollOffset }) => {
    //   onRegisterJump(scrollOffset);
    // },
  });

  const reportedMessage = messages.find((msg) => msg._id === messageToReport);

  const jumpToMessage = useCallback(
    (messageId) => {
      const index = orderedMessages.findIndex((msg) => msg._id === messageId);

      if (index === -1) return;

      rowVirtualizer.measure();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          rowVirtualizer.scrollToIndex(index, {
            align: 'center',
          });
          setTimeout(() => {
            const body = document.getElementById(
              `ec-message-body-${messageId}`
            );
            const element = body?.closest('.ec-message') || body;
            if (!element) return;
            const prevBg = element.style.backgroundColor;
            const prevTransition = element.style.transition;
            element.style.transition = 'background-color 300ms ease';
            element.style.backgroundColor = 'rgba(255, 230, 145, 0.6)';
            setTimeout(() => {
              element.style.backgroundColor = prevBg;
              element.style.transition = prevTransition;
            }, 1000);
          }, 50);
        });
      });
    },
    [orderedMessages, rowVirtualizer]
  );

  useEffect(() => {
    onRegisterJump?.(jumpToMessage);
  }, [onRegisterJump, jumpToMessage]);

  return (
    <>
      <MessageNavigationProvider value={{ jumpToMessage }}>
        {filteredMessages.length === 0 ? (
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
                  position: absolute;
                  top: 0;
                  left: 50%;
                  transform: translateX(-50%);
                  padding: 8px 16px;
                  z-index: 10;
                `}
              >
                <Throbber />
              </Box>
            )}
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                position: 'relative',
                width: '100%',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const { index } = virtualRow;
                const msg = orderedMessages[index];
                if (!msg) return null;

                const prev = orderedMessages[index - 1];
                const next = orderedMessages[index + 1];
                const newDay = isMessageNewDay(msg, prev);
                const sequential = isMessageSequential(msg, prev, 300);
                const lastSequential =
                  sequential && isMessageLastSequential(msg, next);

                return (
                  <div
                    key={msg._id || index}
                    ref={rowVirtualizer.measureElement}
                    data-index={index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <Message
                      message={msg}
                      newDay={newDay}
                      sequential={sequential}
                      lastSequential={lastSequential}
                      type="default"
                      showAvatar
                    />
                  </div>
                );
              })}
            </div>
            {showReportMessage && (
              <MessageReportWindow
                messageId={messageToReport}
                message={reportedMessage}
              />
            )}
          </>
        )}
      </MessageNavigationProvider>
              if (!msg) return null;
              const newDay = isMessageNewDay(msg, prev);
              const sequential = isMessageSequential(msg, prev, 300);
              const lastSequential =
                sequential && isMessageLastSequential(msg, next);
              const showUnreadDivider =
                firstUnreadMessageId && msg._id === firstUnreadMessageId;

              return (
                <React.Fragment key={msg._id}>
                  {showUnreadDivider && (
                    <MessageDivider unread>Unread Messages</MessageDivider>
                  )}
                  <Message
                    message={msg}
                    newDay={newDay}
                    sequential={sequential}
                    lastSequential={lastSequential}
                    type="default"
                    showAvatar
                  />
                </React.Fragment>
              );
            })}
          {showReportMessage && (
            <MessageReportWindow
              messageId={messageToReport}
              message={reportedMessage}
            />
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
