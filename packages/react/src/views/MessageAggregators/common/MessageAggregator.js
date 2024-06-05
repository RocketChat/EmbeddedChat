import React, { useState } from 'react';
import { isSameDay, format } from 'date-fns';
import { Box } from '../../../components/Box';
import { MessageDivider } from '../../Message/MessageDivider';
import Message from '../../Message/Message';
import useMessageAggregatorStyles from './MessageAggregator.styles';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { useMessageStore } from '../../../store';
import { useSetMessageList } from '../../../hooks/useSetMessageList';
import LoadingIndicator from './LoadingIndicator';
import NoMessagesIndicator from './NoMessageIndicator';

export const MessageAggregator = ({
  title,
  iconName,
  noMessageInfo,
  setShowWindow,
  shouldRender,
  searchProps,
  searchFiltered,
}) => {
  const styles = useMessageAggregatorStyles();
  const messages = useMessageStore((state) => state.messages);
  const [messageRendered, setMessageRendered] = useState(false);
  const { loading, messageList } = useSetMessageList(
    searchFiltered || messages,
    shouldRender
  );

  const isMessageNewDay = (current, previous) =>
    !previous ||
    !shouldRender(previous) ||
    !isSameDay(new Date(current.ts), new Date(previous.ts));

  const noMessages = messageList?.length === 0 || !messageRendered;

  return (
    <Sidebar
      title={title}
      iconName={iconName}
      setShowWindow={setShowWindow}
      searchProps={searchProps}
    >
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Box
          css={[
            styles.listContainerStyles,
            noMessages && styles.noMessageStyles,
          ]}
        >
          {noMessages && (
            <NoMessagesIndicator iconName={iconName} message={noMessageInfo} />
          )}

          {messageList.map((msg, index, arr) => {
            const newDay = isMessageNewDay(msg, arr[index - 1]);
            if (!messageRendered && shouldRender(msg)) {
              setMessageRendered(true);
            }
            return (
              <React.Fragment key={msg._id}>
                {newDay && (
                  <MessageDivider>
                    {format(new Date(msg.ts), 'MMMM d, yyyy')}
                  </MessageDivider>
                )}

                <Message
                  key={`${msg._id}-aggregated`}
                  message={msg}
                  newDay={false}
                  type="default"
                  showAvatar
                  showToolbox={false}
                  showRoles={false}
                  isInSidebar
                  style={{
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem',
                  }}
                />
              </React.Fragment>
            );
          })}
        </Box>
      )}
    </Sidebar>
  );
};
