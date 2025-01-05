import React, { useState, useMemo, useContext } from 'react';
import { isSameDay, format } from 'date-fns';
import {
  Box,
  Menu,
  Sidebar,
  Popup,
  useTheme,
  ActionButton,
  Icon,
  useToastBarDispatch,
} from '@embeddedchat/ui-elements';
import RCContext from '../../../context/RCInstance';
import { MessageDivider } from '../../Message/MessageDivider';
import Message from '../../Message/Message';
import getMessageAggregatorStyles from './MessageAggregator.styles';
import { useMessageStore, useSidebarStore, useUserStore } from '../../../store';
import { useSetMessageList } from '../../../hooks/useSetMessageList';
import LoadingIndicator from './LoadingIndicator';
import NoMessagesIndicator from './NoMessageIndicator';
import FileDisplay from '../../FileMessage/FileMessage';
import useSetExclusiveState from '../../../hooks/useSetExclusiveState';
import { useRCContext } from '../../../context/RCInstance';

export const MessageAggregator = ({
  title,
  iconName,
  isStarredMessageDisplay = false,
  isPinnedMessageDisplay = false,
  unstar,
  unpin,
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
  const { RCInstance } = useContext(RCContext);
  const { ECOptions } = useRCContext();
  const showRoles = ECOptions?.showRoles;
  const messages = useMessageStore((state) => state.messages);
  const currentUserRoles = useUserStore((state) => state.roles);
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
  const dispatchToastMessage = useToastBarDispatch();
  const pinPermissions = useUserStore(
    (state) => state.userPinPermissions.roles
  );

  const pinRoles = new Set(pinPermissions);
  const isAllowedToPin = currentUserRoles.some((role) => pinRoles.has(role));

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

  const getMessageLink = async (id) => {
    const host = await RCInstance.getHost();
    const res = await RCInstance.channelInfo();
    return `${host}/channel/${res.room.name}/?msg=${id}`;
  };

  const copyLink = async (id) => {
    try {
      const messageLink = await getMessageLink(id);
      await navigator.clipboard.writeText(messageLink);
      dispatchToastMessage({
        type: 'success',
        message: 'Message link copied successfully',
      });
    } catch (err) {
      dispatchToastMessage({
        type: 'error',
        message: 'Error in copying message link',
      });
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

                    {!isStarredMessageDisplay && !isPinnedMessageDisplay && (
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
                    )}
                    {(isStarredMessageDisplay || isPinnedMessageDisplay) && (
                      <Box
                        style={{
                          marginRight: '20px',
                        }}
                      >
                        <Menu
                          isToolTip={false}
                          options={[
                            isPinnedMessageDisplay && isAllowedToPin
                              ? {
                                  id: 'unpin',
                                  action: () => unpin(msg),
                                  label: 'Unpin',
                                  icon: 'pin',
                                }
                              : isStarredMessageDisplay
                              ? {
                                  id: 'unstar',
                                  action: () => unstar(msg),
                                  label: 'Remove star',
                                  icon: 'star',
                                }
                              : {},
                            {
                              id: 'copyLink',
                              action: () => copyLink(msg._id),
                              label: 'Copy link',
                              icon: 'link',
                            },
                            {
                              id: 'jumptomessage',
                              action: () => setJumpToMessage(msg._id),
                              label: 'Jump to message',
                              icon: 'arrow-jump',
                            },
                          ]}
                        />
                      </Box>
                    )}
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
