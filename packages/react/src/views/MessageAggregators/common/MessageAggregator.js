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
  filterProps,
  searchProps,
  searchFiltered,
  fetching,
  searchedText,
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
    () => [...messages, ...[...threadMessages].reverse()],
    [messages, threadMessages]
  );

  const [messageRendered, setMessageRendered] = useState(false);
  let { messageList } = useSetMessageList(
    fetchedMessageList || searchFiltered || allMessages,
    shouldRender
  );
  const { loading } = useSetMessageList(
    fetchedMessageList || searchFiltered || allMessages,
    shouldRender
  );

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

  const highlightText = (text, searchTerm) => {
    const parts = text.split(searchTerm);
    const result = [];
    result.push({ type: 'PLAIN_TEXT', value: parts[0] });
    result.push({ type: 'HIGHLIGHT_TEXT', value: searchTerm });
    result.push({ type: 'PLAIN_TEXT', value: parts[1] });
    return result;
  };

  function highlightSearchTerm(messagesArr, searchedWords) {
    const searchTerms = Array.isArray(searchedWords)
      ? searchedWords
      : [searchedWords];

    return messagesArr.map((message) => {
      message.md = message.md.map((paragraphBlock) => {
        if (paragraphBlock.type === 'PARAGRAPH') {
          const updatedValue = paragraphBlock.value.reduce(
            (accumulatedValue, content) => {
              if (content.type === 'PLAIN_TEXT') {
                let updatedContent = content.value;
                searchTerms.forEach((searchTerm) => {
                  if (updatedContent.includes(searchTerm)) {
                    // Highlight the search term and clear the updated content
                    accumulatedValue.push(
                      ...highlightText(updatedContent, searchTerm)
                    );
                    updatedContent = '';
                  }
                });

                if (updatedContent) {
                  accumulatedValue.push({
                    type: 'PLAIN_TEXT',
                    value: updatedContent,
                  });
                }
              } else if (content.type === 'LINK') {
                // Handle LINK elements, applying highlight only to label if it exists
                if (content.label && Array.isArray(content.label)) {
                  console.log('====== 1 ======');
                  const updatedLabel = content.label.reduce(
                    (labelAccumulatedValue, labelContent) => {
                      console.log('====== 2 ======');
                      if (labelContent.type === 'PLAIN_TEXT') {
                        let updatedContent = labelContent.value;
                        searchTerms.forEach((searchTerm) => {
                          if (updatedContent.includes(searchTerm)) {
                            labelAccumulatedValue.push(
                              ...highlightText(updatedContent, searchTerm)
                            );
                            updatedContent = '';
                          }
                        });

                        if (updatedContent) {
                          labelAccumulatedValue.push({
                            type: 'PLAIN_TEXT',
                            value: updatedContent,
                          });
                        }
                      } else {
                        labelAccumulatedValue.push(labelContent); // For non-PLAIN_TEXT content, leave as is
                      }
                      return labelAccumulatedValue;
                    },
                    []
                  );

                  // Push the updated LINK with modified label
                  accumulatedValue.push({
                    ...content,
                    label: updatedLabel,
                  });
                } else {
                  // If no label found, just push the content as is
                  console.log('No value found');
                  accumulatedValue.push(content);
                }
              } else if (
                content.type === 'STRIKE' ||
                content.type === 'BOLD' ||
                content.type === 'ITALIC'
              ) {
                // For custom formatting tags like STRIKE, BOLD, ITALIC, recursively highlight the inner contents
                const updatedContents = content.value.reduce(
                  (innerAccumulatedValue, innerContent) => {
                    if (innerContent.type === 'PLAIN_TEXT') {
                      let updatedContent = innerContent.value;
                      searchTerms.forEach((searchTerm) => {
                        if (updatedContent.includes(searchTerm)) {
                          innerAccumulatedValue.push(
                            ...highlightText(updatedContent, searchTerm)
                          );
                          updatedContent = '';
                        }
                      });

                      if (updatedContent) {
                        innerAccumulatedValue.push({
                          type: 'PLAIN_TEXT',
                          value: updatedContent,
                        });
                      }
                    } else {
                      innerAccumulatedValue.push(innerContent); // For non-PLAIN_TEXT content, keep unchanged
                    }

                    return innerAccumulatedValue;
                  },
                  []
                );

                // Push the modified formatting tags with updated contents
                accumulatedValue.push({
                  ...content,
                  value: updatedContents,
                });
              } else {
                accumulatedValue.push(content); // For non-PLAIN_TEXT or non-formatted content, add as is
              }

              return accumulatedValue;
            },
            []
          );

          // Return the updated paragraph block
          return {
            ...paragraphBlock,
            value: updatedValue,
          };
        }
        return paragraphBlock; // For non-PARAGRAPH blocks, return unchanged
      });

      return message;
    });
  }

  if (title === 'Search Messages') {
    if (messageList) {
      // console.log('messageList: ' + JSON.stringify(messageList));
      const highlightedMessages = highlightSearchTerm(
        messageList,
        searchedText
      );
      messageList = highlightedMessages;
      // console.log('after messageList: ' + JSON.stringify(messageList));
    }
  }

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
            }
          )}
        </Box>
      )}
    </ViewComponent>
  );
};
