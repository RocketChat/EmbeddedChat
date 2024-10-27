import React, { useState, useMemo } from 'react';
import { isSameDay, format } from 'date-fns';
import { Box, Sidebar, Popup, useTheme } from '@embeddedchat/ui-elements';
import { MessageDivider } from '../../Message/MessageDivider';
import Message from '../../Message/Message';
import getMessageAggregatorStyles from './MessageAggregator.styles';
import { useMessageStore } from '../../../store';
import { useSetMessageList } from '../../../hooks/useSetMessageList';
import LoadingIndicator from './LoadingIndicator';
import NoMessagesIndicator from './NoMessageIndicator';
import FileDisplay from '../../FileMessage/FileMessage';
import useSetExclusiveState from '../../../hooks/useSetExclusiveState';

export const MessageAggregator = ({
  title,
  iconName,
  noMessageInfo,
  shouldRender,
  searchProps,
  searchFiltered,
  fetching,
  type = 'message',
  viewType = 'Sidebar',
}) => {
  const { theme } = useTheme();
  const styles = getMessageAggregatorStyles(theme);
  const setExclusiveState = useSetExclusiveState();
  const messages = useMessageStore((state) => state.messages);
  const threadMessages = useMessageStore((state) => state.threadMessages) || [];
  const allMessages = useMemo(
    () => [...messages, ...threadMessages],
    [messages, threadMessages]
  );
  const [messageRendered, setMessageRendered] = useState(false);
  const { loading, messageList } = useSetMessageList(
    searchFiltered || allMessages,
    shouldRender
  );

  const isMessageNewDay = (current, previous) =>
    !previous ||
    !shouldRender(previous) ||
    !isSameDay(new Date(current.ts), new Date(previous.ts));

  const noMessages = messageList?.length === 0 || !messageRendered;
  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;

  return (
    <ViewComponent
      title={title}
      iconName={iconName}
      searchProps={searchProps}
      onClose={() => setExclusiveState(null)}
      style={{ padding: 0 }}
      {...(viewType === 'Popup'
        ? {
            isPopupHeader: true,
          }
        : {})}
    >
      {fetching || loading ? (
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
                {type === 'message' && newDay && (
                  <MessageDivider>
                    {format(new Date(msg.ts), 'MMMM d, yyyy')}
                  </MessageDivider>
                )}
                {type === 'file' ? (
                  <FileDisplay
                    key={`${msg._id}-aggregated`}
                    fileMessage={msg}
                  />
                ) : (
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
                )}
              </React.Fragment>
            );
          })}
        </Box>
      )}
    </ViewComponent>
  );
};
