import React, {
  useState,
  useMemo,
  forwardRef,
  useCallback,
  useEffect,
} from 'react';

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
import { useUserStore } from '../../../store';

export const MessageAggregator = (
  (
    {
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
      threadListRef={threadListRef}
    },
    
  ) => {
    const { theme } = useTheme();
    const styles = getMessageAggregatorStyles(theme);
    const setExclusiveState = useSetExclusiveState();
    const { ECOptions } = useRCContext();
    const showRoles = ECOptions?.showRoles;
    const messages = useMessageStore((state) => state.messages);
    const isUserAuthenticated = useUserStore(
      (state) => state.isUserAuthenticated
    );
    const threadOffset = useMessageStore((state) => state.threadOffset);
    const setOffset = useMessageStore((state) => state.setOffset);
    const [, setIsUserScrolledUp] = useState(false);
    const setAllThreadMessages = useMessageStore(
      (state) => state.setAllThreadMessages
    );
    const allThreadMessages = useMessageStore(
      (state) => state.allThreadMessages
    );

    const threadMessages =
      useMessageStore((state) => state.threadMessages) || [];
    const allMessages = useMemo(
      () => [...messages, ...[...threadMessages].reverse()],
      [messages, threadMessages]
    );
    const [scrollPosition, setScrollPosition] = useState(0);
    const [popupVisible, setPopupVisible] = useState(false);
    const [isFetching, setIsFetching] = useState(false);

    const [messageRendered, setMessageRendered] = useState(false);
    const { loading, messageList } = useSetMessageList(
      fetchedMessageList || searchFiltered || allMessages,
      shouldRender
    );
    const { RCInstance } = useRCContext();
    const showSidebar = useSidebarStore((state) => state.showSidebar);

    const setShowSidebar = useSidebarStore((state) => state.setShowSidebar);
    const openThread = useMessageStore((state) => state.openThread);
    const closeThread = useMessageStore((state) => state.closeThread);

    const setJumpToMessage = (msg) => {
      if (!msg || !msg._id) {
        console.error('Invalid message object:', msg);
        return;
      }
      const { _id: msgId, tmid: threadId } = msg;
      if (msgId) {
        let element;
        if (threadId) {
          const parentMessage = messages.find((m) => m._id === threadId);
          if (parentMessage) {
            closeThread();
            setTimeout(() => {
              openThread(parentMessage);
              setShowSidebar(false);
              setTimeout(() => {
                element = document.getElementById(`ec-message-body-${msgId}`);
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                  });
                  element.style.backgroundColor = theme.colors.warning;
                  setTimeout(() => {
                    element.style.backgroundColor = '';
                  }, 1000);
                }
              }, 300);
            }, 300);
          }
        } else {
          closeThread();
          setTimeout(() => {
            element = document.getElementById(`ec-message-body-${msgId}`);
            if (element) {
              setShowSidebar(false);
              element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              element.style.backgroundColor = theme.colors.warning;
              setTimeout(() => {
                element.style.backgroundColor = '';
              }, 1000);
            }
          }, 300);
        }
      }
    };

    const isMessageNewDay = (current, previous) =>
      !previous ||
      shouldRender(previous) ||
      !isSameDay(new Date(current.ts), new Date(previous.ts));

    const noMessages = messageList?.length === 0 || !messageRendered;
    const ViewComponent = viewType === 'Popup' ? Popup : Sidebar;

    const getAllThreads = useCallback(
      async (offset = 0) => {
        if (isUserAuthenticated && !isFetching) {
          setIsFetching(true);
          try {
            const { threads: fetchedThreadMessages } =
              await RCInstance.getAllThreadMessages('', '', offset, 30);

            setAllThreadMessages(fetchedThreadMessages, true);

            setOffset(offset + 30);
          } catch (e) {
            console.error(e);
          } finally {
            setIsFetching(false);
          }
        }
      },
      [
        isUserAuthenticated,
        isFetching,
        RCInstance,
        setAllThreadMessages,
        setOffset,
      ]
    );

    const handleThreadScroll = useCallback(() => {
      console.log('heerrrthreadsfdsf');
      if (threadListRef && threadListRef.current) {
        setScrollPosition(threadListRef.current.scrollTop);
        setIsUserScrolledUp(
          threadListRef.current.scrollTop + threadListRef.current.clientHeight <
            threadListRef.current.scrollHeight
        );
      }

      const isAtBottom =
        threadListRef?.current?.scrollTop +
          threadListRef.current.clientHeight >=
        threadListRef.current.scrollHeight - 100;
      console.log('bootom', isAtBottom);
      if (isAtBottom) {
        console.log('here');
        getAllThreads(threadListRef.current.children.length);
      }
    }, [threadListRef, setScrollPosition, setIsUserScrolledUp, getAllThreads]);
    useEffect(() => {
      console.log('threadListRef', threadListRef);
      if (threadListRef.current) {
        console.log('Adding scroll event listener');
        threadListRef.current.addEventListener('scroll', handleThreadScroll);
      }
      return () => {
        if (threadListRef.current) {
          threadListRef.current.removeEventListener(
            'scroll',
            handleThreadScroll
          );
        }
      };
    }, [handleThreadScroll, threadListRef]);

    useEffect(() => {
      getAllThreads();
    }, [showSidebar]);

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
            ref={threadListRef}
            css={[
              styles.listContainerStyles,
              noMessages && styles.noMessageStyles,
            ]}
          >
            {noMessages && (
              <NoMessagesIndicator
                iconName={iconName}
                message={noMessageInfo}
              />
            )}

            {[
              ...new Map(messageList.map((msg) => [msg._id, msg])).values(),
            ].map((msg, index, arr) => {
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
                        onClick={() => setJumpToMessage(msg)}
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
  }
);
