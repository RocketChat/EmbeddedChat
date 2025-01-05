import React, { useState, useMemo } from 'react';
import { isSameDay, format } from 'date-fns';
import {
  Box,
  Sidebar,
  Popup,
  useTheme,
  ActionButton,
  Icon,
} from '@embeddedchat/ui-elements';
import { MessageDivider } from '../../Message/MessageDivider';
import Message from '../../Message/Message';
import getMessageAggregatorStyles from './MessageAggregator.styles';
import { useMessageStore, useSidebarStore } from '../../../store';
import { useSetMessageList } from '../../../hooks/useSetMessageList';
import LoadingIndicator from './LoadingIndicator';
import NoMessagesIndicator from './NoMessageIndicator';
import FileDisplay from '../../FileMessage/FileMessage';
import useSetExclusiveState from '../../../hooks/useSetExclusiveState';
import { useRCContext } from '../../../context/RCInstance';

export const MessageAggregator = ({
  title,
  iconName,
  noMessageInfo,
  shouldRender,
  fetchedMessageList,
  searchProps,
  searchFiltered,
  fetching,
  type = 'message',
  viewType = 'Sidebar',
}) => {
  const { theme } = useTheme();
  const styles = getMessageAggregatorStyles(theme);
  const setExclusiveState = useSetExclusiveState();
  const { ECOptions } = useRCContext();
  const showRoles = ECOptions?.showRoles;
  const messages = useMessageStore((state) => state.messages);
  const threadMessages = useMessageStore((state) => state.threadMessages) || [];
  const allMessages = useMemo(
    () => [...messages, ...threadMessages],
    [messages, threadMessages]
  );
  const [messageRendered, setMessageRendered] = useState(false);
  const { loading, messageList } = useSetMessageList(
    fetchedMessageList || searchFiltered || allMessages,
    shouldRender
  );

  const setShowSidebar = useSidebarStore((state) => state.setShowSidebar);
  const setJumpToMessage = (msgId) => {
    if (msgId) {
      const element = document.getElementById(`ec-message-body-${msgId}`);
      if (element) {
        setShowSidebar(false);
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        element.style.backgroundColor = theme.colors.warning;
        setTimeout(() => {
          element.style.backgroundColor = '';
        }, 1000);
      }
    }
  };

  const isMessageNewDay = (current, previous) =>
    !previous ||
    shouldRender(previous) ||
    !isSameDay(new Date(current.ts), new Date(previous.ts));

  const noMessages = messageList?.length === 0 || !messageRendered;
  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;

  return (
    <ViewComponent
      title={title}
      iconName={iconName}
      searchProps={searchProps}
      onClose={() => setExclusiveState(null)}
      style={{
        width: '400px',
        padding: 0,
        zIndex: window.innerWidth <= 780 ? 1 : null,
      }}
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
                  <Box
                    position="relative"
                    style={{
                      display: 'flex',
                    }}
                  >
                    <Message
                      key={`${msg._id}-aggregated`}
                      message={msg}
                      newDay={false}
                      type="default"
                      showAvatar
                      showToolbox={false}
                      showRoles={showRoles}
                      isInSidebar
                      style={{
                        flex: 1,
                        padding: 0,
                        marginLeft: '15px',
                        minWidth: 0,
                      }}
                    />

                    <ActionButton
                      square
                      ghost
                      onClick={() => setJumpToMessage(msg._id)}
                      css={{
                        position: 'relative',
                        zIndex: 10,
                        marginRight: '5px',
                      }}
                    >
                      <Icon name="arrow-back" size="1.25rem" />
                    </ActionButton>
                  </Box>
                )}
              </React.Fragment>
            );
          })}
        </Box>
      )}
    </ViewComponent>
  );
};
