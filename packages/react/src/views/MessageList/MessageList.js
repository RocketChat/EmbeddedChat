import React, { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { isSameDay } from 'date-fns';
import { Box, Icon, Throbber } from '@embeddedchat/ui-elements';
import { useMessageStore } from '../../store';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import isMessageSequential from '../../lib/isMessageSequential';
import { Message } from '../Message';
import isMessageLastSequential from '../../lib/isMessageLastSequential';
import { MessageBody } from '../Message/MessageBody';
import { MessageDivider } from '../Message/MessageDivider';

const MessageListHeader = ({
  context: { loadingOlderMessages, isUserAuthenticated, hasMoreMessages },
}) => {
  if (loadingOlderMessages && isUserAuthenticated) {
    return (
      <Box
        css={css`
          padding: 8px 16px;
          text-align: center;
        `}
      >
        <Throbber />
      </Box>
    );
  }
  if (!hasMoreMessages && isUserAuthenticated) {
    return (
      <MessageBody style={{ textAlign: 'center', padding: '10px' }}>
        Start of conversation
      </MessageBody>
    );
  }
  return null;
};

const MessageListPlaceholder = ({ context: { isMessageLoaded } }) => (
  <Box
    css={css`
      text-align: center;
      margin: auto;
      padding-top: 50%;
    `}
  >
    <Icon name="thread" size="2rem" />
    <Box>
      {isMessageLoaded
        ? 'No messages'
        : 'Ready to chat? Login now to join the fun.'}
    </Box>
  </Box>
);

const renderMessageItem = (
  index,
  msg,
  { filteredMessages, firstUnreadMessageId }
) => {
  const prev = filteredMessages[index - 1];
  const next = filteredMessages[index + 1];

  if (!msg) return null;

  const newDay = !prev || !isSameDay(new Date(msg.ts), new Date(prev.ts));
  const sequential = isMessageSequential(msg, prev, 300);
  const lastSequential = sequential && isMessageLastSequential(msg, next);
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
};

const MessageList = ({
  messages,
  loadingOlderMessages,
  isUserAuthenticated,
  hasMoreMessages,
  firstUnreadMessageId,
  loadMoreMessages,
  scrollerRef,
  onAtBottomStateChange,
}) => {
  const showReportMessage = useMessageStore((state) => state.showReportMessage);
  const messageToReport = useMessageStore((state) => state.messageToReport);
  const isMessageLoaded = useMessageStore((state) => state.isMessageLoaded);

  const filteredMessages = messages.filter((msg) => !msg.tmid);

  const reportedMessage = messages.find((msg) => msg._id === messageToReport);

  const virtuosoComponents = useMemo(
    () => ({
      Header: MessageListHeader,
      EmptyPlaceholder: MessageListPlaceholder,
    }),
    []
  );

  return (
    <>
      <Virtuoso
        style={{ height: '100%', width: '100%' }}
        data={filteredMessages}
        initialTopMostItemIndex={filteredMessages.length - 1}
        alignToBottom
        scrollerRef={scrollerRef}
        atBottomStateChange={onAtBottomStateChange}
        startReached={loadingOlderMessages ? undefined : loadMoreMessages}
        context={{
          loadingOlderMessages,
          isUserAuthenticated,
          hasMoreMessages,
          isMessageLoaded,
          filteredMessages,
          firstUnreadMessageId,
        }}
        components={virtuosoComponents}
        itemContent={renderMessageItem}
      />
      {showReportMessage && (
        <MessageReportWindow
          messageId={messageToReport}
          message={reportedMessage}
        />
      )}
    </>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape),
};

export default MessageList;
