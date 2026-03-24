import React, { memo, useContext, useState } from 'react';
import { css } from '@emotion/react';

import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  useToastBarDispatch,
  useComponentOverrides,
  appendClassNames,
  useTheme,
  lighten,
  darken,
  Icon,
} from '@embeddedchat/ui-elements';
import { Attachments } from '../AttachmentHandler';
import { Markdown } from '../Markdown';
import MessageHeader from './MessageHeader';
import { useMessageStore, useUserStore, useSidebarStore } from '../../store';
import RCContext from '../../context/RCInstance';
import { MessageBody } from './MessageBody';
import { MessageReactions } from './MessageReactions';
import { MessageMetrics } from './MessageMetrics';
import { MessageToolbox } from './MessageToolbox';
import { MessageDivider } from './MessageDivider';
import MessageAvatarContainer from './MessageAvatarContainer';
import MessageBodyContainer from './MessageBodyContainer';
import { LinkPreview } from '../LinkPreview';
import { getMessageStyles } from './Message.styles';
import useBubbleStyles from './BubbleVariant/useBubbleStyles';
import UiKitMessageBlock from './uiKit/UiKitMessageBlock';
import useFetchChatData from '../../hooks/useFetchChatData';

const Message = ({
  message,
  type = 'default',
  sequential = false,
  lastSequential = false,
  newDay = false,
  showAvatar = false,
  className = '',
  style = {},
  showToolbox = true,
  showRoles = true,
  isLinkPreview = true,
  isInSidebar = false,
}) => {
  const { classNames, styleOverrides, variantOverrides } =
    useComponentOverrides(
      'Message',
      [message.messageParentBox, className],
      style
    );

  const { RCInstance, ECOptions } = useContext(RCContext);
  showAvatar = ECOptions?.showAvatar && showAvatar;
  const { showSidebar, setShowSidebar } = useSidebarStore();
  const authenticatedUserId = useUserStore((state) => state.userId);
  const authenticatedUserUsername = useUserStore((state) => state.username);
  const userRoles = useUserStore((state) => state.roles);
  const pinPermissions = useUserStore(
    (state) => state.userPinPermissions.roles
  );
  const editMessagePermissions = useMessageStore(
    (state) => state.editMessagePermissions.roles
  );
  const [setMessageToReport, toggleShowReportMessage] = useMessageStore(
    (state) => [state.setMessageToReport, state.toggleShowReportMessage]
  );
  const addQuoteMessage = useMessageStore((state) => state.addQuoteMessage);
  const openThread = useMessageStore((state) => state.openThread);
  const { getStarredMessages } = useFetchChatData();
  const dispatchToastMessage = useToastBarDispatch();
  const { editMessage, setEditMessage } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
  }));
  const deleteMessagePermissions = useMessageStore(
    (state) => state.deleteMessageRoles.roles
  );
  const deleteOwnMessagePermissions = useMessageStore(
    (state) => state.deleteOwnMessageRoles.roles
  );
  const forceDeleteMessagePermissions = useMessageStore(
    (state) => state.forceDeleteMessageRoles.roles
  );
  const { removeMessage, replaceMessage } = useMessageStore((state) => ({
    removeMessage: state.removeMessage,
    replaceMessage: state.replaceMessage,
  }));
  const [isErrorMenuOpen, setIsErrorMenuOpen] = useState(false);

  const isMe = message.u._id === authenticatedUserId;

  const theme = useTheme();
  const { mode } = useTheme();
  const styles = getMessageStyles(theme);
  const hasType = Boolean(message.t);

  const hoverStyle = hasType
    ? {}
    : {
        '&:hover': {
          backgroundColor:
            mode === 'light'
              ? darken(theme.theme.colors.background, 0.03)
              : lighten(theme.theme.colors.background, 1),
        },
      };

  const bubbleStyles = useBubbleStyles(isMe);
  const pinRoles = new Set(pinPermissions);
  const editMessageRoles = new Set(editMessagePermissions);
  const deleteMessageRoles = new Set(deleteMessagePermissions);
  const deleteOwnMessageRoles = new Set(deleteOwnMessagePermissions);
  const forceDeleteMessageRoles = new Set(forceDeleteMessagePermissions);

  const variantStyles =
    !isInSidebar && variantOverrides === 'bubble' ? bubbleStyles : {};

  const handleStarMessage = async (msg) => {
    const isStarred =
      msg.starred && msg.starred.find((u) => u._id === authenticatedUserId);
    if (!isStarred) {
      await RCInstance.starMessage(msg._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message starred',
      });
    } else {
      await RCInstance.unstarMessage(msg._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message unstarred',
      });
    }
    getStarredMessages();
  };

  const handlePinMessage = async (msg) => {
    const isPinned = msg.pinned;
    msg.pinned = !isPinned;
    const pinOrUnpin = isPinned
      ? await RCInstance.unpinMessage(msg._id)
      : await RCInstance.pinMessage(msg._id);
    if (pinOrUnpin.error) {
      msg.pinned = isPinned;
      dispatchToastMessage({
        type: 'error',
        message: 'Error pinning message',
      });
    } else {
      dispatchToastMessage({
        type: 'success',
        message: isPinned ? 'Message unpinned' : 'Message pinned',
      });
    }
  };

  const handleCopyMessage = async (msg) => {
    const textToCopy =
      msg.msg ||
      (msg.attachments && msg.attachments[0]
        ? msg.attachments[0].description || msg.attachments[0].title
        : '');

    try {
      await navigator.clipboard.writeText(textToCopy);
      dispatchToastMessage({
        type: 'success',
        message: 'Message copied successfully',
      });
    } catch (error) {
      dispatchToastMessage({
        type: 'error',
        message: 'Error in copying message',
      });
    }
  };

  const getMessageLink = async (id) => {
    const host = await RCInstance.getHost();
    const res = await RCInstance.channelInfo();
    return `${host}/channel/${res.room.name}/?msg=${id}`;
  };

  const handleCopyMessageLink = async (msg) => {
    try {
      const messageLink = await getMessageLink(msg._id);
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

  const handleDeleteMessage = async (msg) => {
    if (msg.isError) {
      removeMessage(msg._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message deleted successfully',
      });
      return;
    }
    const res = await RCInstance.deleteMessage(msg._id);

    if (res.success) {
      dispatchToastMessage({
        type: 'success',
        message: 'Message deleted successfully',
      });
    } else {
      dispatchToastMessage({
        type: 'error',
        message: 'Error in deleting message',
      });
    }
    getStarredMessages();
  };

  const handleResendMessage = async () => {
    const now = new Date().toISOString();
    const pendingMessage = {
      ...message,
      isError: false,
      isPending: true,
      ts: now,
      _updatedAt: now,
    };
    replaceMessage(message._id, pendingMessage);

    if (!navigator.onLine) {
      const erroredMessage = {
        ...pendingMessage,
        isError: true,
        isPending: false,
      };
      replaceMessage(pendingMessage._id, erroredMessage);
      return;
    }

    const res = await RCInstance.sendMessage(
      {
        msg: message.msg,
        _id: message._id,
      },
      message.tmid
    );

    if (res.success) {
      replaceMessage(pendingMessage._id, res.message);
    } else {
      const erroredMessage = {
        ...pendingMessage,
        isError: true,
        isPending: false,
      };
      replaceMessage(pendingMessage._id, erroredMessage);
    }
  };

  const handleEmojiClick = async (e, msg, canReact) => {
    const emoji = (e.names?.[0] || e.name).replace(/\s/g, '_');
    await RCInstance.reactToMessage(emoji, msg._id, canReact);
  };

  const handleOpenThread = (msg) => async () => {
    openThread(msg);
    setShowSidebar(false);
  };

  const isStarred = message.starred?.find((u) => u._id === authenticatedUserId);
  const isPinned = message.pinned;
  const shouldShowHeader = !sequential || (!showAvatar && isStarred);

  return (
    <>
      {newDay && (
        <MessageDivider>
          {format(new Date(message.ts), 'MMMM d, yyyy')}
        </MessageDivider>
      )}
      <Box
        className={appendClassNames('ec-message', classNames)}
        css={[
          variantStyles.messageParent || styles.main,
          hoverStyle,
          editMessage._id === message._id && styles.messageEditing,
          message.isError &&
            css`
              color: ${theme.theme.colors.destructive};
            `,
        ]}
        style={styleOverrides}
      >
        {showAvatar && (
          <MessageAvatarContainer
            message={message}
            sequential={sequential}
            isStarred={isStarred}
            isPinned={isPinned}
          />
        )}
        <MessageBodyContainer
          variantStyles={variantStyles}
          style={{ maxWidth: message?.t ? '90%' : null }}
        >
          {shouldShowHeader && (
            <MessageHeader
              message={message}
              isRoles={showRoles}
              {...(variantStyles?.name?.includes('bubble') && {
                showDisplayName: !isMe,
              })}
            />
          )}
          {!message.t ? (
            <>
              <MessageBody
                className="ec-message-body"
                id={`ec-message-body-${message._id}`}
                css={message.isPending && styles.pendingMessageBody}
                variantStyles={variantStyles}
                isText={!!message.md}
                sequential={sequential}
                lastSequential={lastSequential}
              >
                {message.attachments && message.attachments.length > 0 ? (
                  <>
                    <Markdown
                      body={message}
                      md={message.md}
                      isReaction={false}
                    />
                    <Attachments
                      attachments={message.attachments}
                      variantStyles={variantStyles}
                      msg={message}
                    />
                  </>
                ) : (
                  <Markdown body={message} md={message.md} isReaction={false} />
                )}

                {message.blocks && (
                  <UiKitMessageBlock
                    rid={RCInstance.rid}
                    mid={message._id}
                    blocks={message.blocks}
                  />
                )}

                {!message.t && showToolbox && !message.isError ? (
                  <MessageToolbox
                    message={message}
                    isEditing={editMessage._id === message._id}
                    authenticatedUserId={authenticatedUserId}
                    userRoles={userRoles}
                    pinRoles={pinRoles}
                    deleteMessageRoles={deleteMessageRoles}
                    deleteOwnMessageRoles={deleteOwnMessageRoles}
                    forceDeleteMessageRoles={forceDeleteMessageRoles}
                    editMessageRoles={editMessageRoles}
                    handleCopyMessage={handleCopyMessage}
                    handleCopyMessageLink={handleCopyMessageLink}
                    handleOpenThread={handleOpenThread}
                    handleDeleteMessage={handleDeleteMessage}
                    handleStarMessage={handleStarMessage}
                    handlePinMessage={handlePinMessage}
                    handleEditMessage={() => {
                      if (editMessage._id === message._id) {
                        setEditMessage({});
                      } else {
                        setEditMessage(message);
                      }
                    }}
                    handleQuoteMessage={() => addQuoteMessage(message)}
                    handleEmojiClick={handleEmojiClick}
                    handlerReportMessage={() => {
                      setMessageToReport(message._id);
                      toggleShowReportMessage();
                    }}
                    isThreadMessage={type === 'thread'}
                    variantStyles={variantStyles}
                  />
                ) : null}
              </MessageBody>
              {message.isError && (
                <Box
                  css={css`
                    position: absolute;
                    top: 50%;
                    right: 0.5rem;
                    transform: translateY(-50%);
                    z-index: 10;
                  `}
                >
                  <Icon
                    name="offline"
                    size="0.875em"
                    style={{
                      cursor: 'pointer',
                      color: theme.theme.colors.danger || '#e5424d',
                      opacity: 0.7,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsErrorMenuOpen(!isErrorMenuOpen);
                    }}
                  />
                  {isErrorMenuOpen && (
                    <Box
                      css={css`
                        position: absolute;
                        bottom: 110%;
                        right: 0;
                        background-color: ${theme.theme.colors.background};
                        box-shadow: ${theme.theme.shadows[2]};
                        border-radius: ${theme.theme.radius};
                        z-index: 100;
                        border: 1px solid ${theme.theme.colors.border};
                        display: flex;
                        flex-direction: column;
                        width: fit-content;
                        overflow: hidden;
                      `}
                    >
                      <Box
                        css={css`
                          padding: 0.5rem 1rem;
                          display: flex;
                          align-items: center;
                          gap: 0.5rem;
                          cursor: pointer;
                          white-space: nowrap;
                          font-size: 0.875rem;
                          color: ${theme.theme.colors.foreground};
                          &:hover {
                            background-color: ${theme.theme.colors.secondary};
                          }
                        `}
                        onClick={() => {
                          handleResendMessage();
                          setIsErrorMenuOpen(false);
                        }}
                      >
                        <Icon name="send" size="1em" />
                        Resend
                      </Box>
                      <Box
                        css={css`
                          padding: 0.5rem 1rem;
                          display: flex;
                          align-items: center;
                          gap: 0.5rem;
                          cursor: pointer;
                          white-space: nowrap;
                          font-size: 0.875rem;
                          color: ${theme.theme.colors.destructive};
                          &:hover {
                            background-color: ${theme.theme.colors.secondary};
                          }
                        `}
                        onClick={() => {
                          handleDeleteMessage(message);
                          setIsErrorMenuOpen(false);
                        }}
                      >
                        <Icon name="trash" size="1em" />
                        Delete
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {isLinkPreview &&
                message.urls &&
                message.urls.map(
                  (url, index) =>
                    url.meta && (
                      <LinkPreview
                        key={index}
                        url={url.url}
                        meta={url.meta}
                        {...(variantStyles?.name?.includes('bubble') && {
                          showDropdown: false,
                        })}
                      />
                    )
                )}

              <MessageReactions
                authenticatedUserUsername={authenticatedUserUsername}
                message={message}
                handleEmojiClick={handleEmojiClick}
              />
            </>
          ) : (
            <>
              {message.attachments && (
                <Attachments
                  attachments={message.attachments}
                  type={message.t}
                  variantStyles={variantStyles}
                />
              )}
            </>
          )}
          {message.tcount && type !== 'thread' ? (
            <MessageMetrics
              message={message}
              handleOpenThread={handleOpenThread}
              variantStyles={variantStyles}
            />
          ) : null}
        </MessageBodyContainer>
      </Box>
    </>
  );
};
Message.propTypes = {
  message: PropTypes.any,
  sequential: PropTypes.bool,
  newDay: PropTypes.bool,
  type: PropTypes.oneOf(['thread', 'default']),
  showAvatar: PropTypes.bool,
};

export default memo(Message);
