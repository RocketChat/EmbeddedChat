import React, { useState, useMemo, useContext } from 'react';
import { isSameDay, format } from 'date-fns';
import {
  Box,
  Sidebar,
  Popup,
  useTheme,
  ActionButton,
  Icon,
  lighten,
  darken,
  Throbber,
} from '@embeddedchat/ui-elements';
import { MessageDivider } from '../../Message/MessageDivider';
import Message from '../../Message/Message';
import getMessageAggregatorStyles from './MessageAggregator.styles';
import { MessageNavigationContext } from '../../../context/MessageNavigationContext';
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
  filterProps,
  searchProps,
  searchFiltered,
  fetching,
  type = 'message',
  viewType = 'Sidebar',
}) => {
  const { theme } = useTheme();
  const { mode } = useTheme();
  const styles = getMessageAggregatorStyles(theme);
  const setExclusiveState = useSetExclusiveState();
  const { ECOptions } = useRCContext();
  const showRoles = ECOptions?.showRoles;
  const messages = useMessageStore((state) => state.messages);
  const threadMessages = useMessageStore((state) => state.threadMessages);
  const allMessages = useMemo(
    () => [...messages, ...[...(threadMessages || [])].reverse()],
    [messages, threadMessages]
  );

  const [messageRendered, setMessageRendered] = useState(false);
  const [loadingMessageId, setLoadingMessageId] = useState(null);
  const { loading, messageList } = useSetMessageList(
    fetchedMessageList || searchFiltered || allMessages,
    shouldRender
  );

  const setShowSidebar = useSidebarStore((state) => state.setShowSidebar);
  const openThread = useMessageStore((state) => state.openThread);
  const closeThread = useMessageStore((state) => state.closeThread);

  const { jumpToMessage } = useContext(MessageNavigationContext);

  const highlightMessage = (element) => {
    if (!element) return;

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });

    element.style.backgroundColor =
      mode === 'light'
        ? lighten(theme.colors.warning, 0.85)
        : darken(theme.colors.warningForeground, 0.75);

    setTimeout(() => {
      element.style.backgroundColor = '';
    }, 2000);
  };

  const waitForMessageElement = (messageId, attempts = 20) =>
    new Promise((resolve) => {
      const findElement = (remainingAttempts) => {
        const childElement = document.getElementById(
          `ec-message-body-${messageId}`
        );
        const element = childElement?.closest('.ec-message') || childElement;

        if (element || remainingAttempts <= 0) {
          resolve(element || null);
          return;
        }

        setTimeout(() => {
          findElement(remainingAttempts - 1);
        }, 150);
      };

      findElement(attempts);
    });

  const setJumpToMessage = async (msg) => {
    if (!msg?._id) {
      return;
    }

    const { _id: msgId, tmid: threadId } = msg;

    if (!threadId) {
      closeThread();
      await jumpToMessage?.(msgId);
      const element = await waitForMessageElement(msgId, 10);
      highlightMessage(element);
      return;
    }

    closeThread();
    await jumpToMessage?.(threadId);

    const parentMessage = useMessageStore
      .getState()
      .messages.find((message) => message._id === threadId);

    if (!parentMessage) {
      return;
    }

    openThread(parentMessage);
    setShowSidebar(false);

    const element = await waitForMessageElement(msgId);
    highlightMessage(element);
  };

  const isMessageNewDay = (current, previous) =>
    !previous ||
    shouldRender(previous) ||
    !isSameDay(new Date(current.ts), new Date(previous.ts));

  const noMessages = messageList?.length === 0 || !messageRendered;
  const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;

  const handleOnActionClick = async (msg) => {
    if (!msg?._id) return;
    setLoadingMessageId(msg._id);
    try {
      await setJumpToMessage(msg);
    } finally {
      setLoadingMessageId(null);
    }
  };

  return (
    <ViewComponent
      title={title}
      iconName={iconName}
      filterProps={filterProps}
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

          {[...new Map(messageList.map((msg) => [msg._id, msg])).values()].map(
            (msg, index, arr) => {
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
                    <>
                      <FileDisplay
                        key={`${msg._id}-aggregated`}
                        fileMessage={msg}
                        onClick={setJumpToMessage}
                      />
                    </>
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
                        disabled={loadingMessageId === msg._id}
                        onClick={() => handleOnActionClick(msg)}
                        css={{
                          position: 'relative',
                          zIndex: 10,
                          marginRight: '5px',
                        }}
                      >
                        {loadingMessageId === msg._id ? (
                          <Throbber size="12px" />
                        ) : (
                          <Icon name="arrow-back" size="1.25rem" />
                        )}
                      </ActionButton>
                    </Box>
                  )}
                </React.Fragment>
              );
            }
          )}
        </Box>
      )}
    </ViewComponent>
  );
};
