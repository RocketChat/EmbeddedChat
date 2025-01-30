import React, { memo, useContext } from 'react';
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

                {!message.t && showToolbox ? (
                  <MessageToolbox
                    message={message}
                    isEditing={editMessage._id === message._id}
                    authenticatedUserId={authenticatedUserId}
                    userRoles={userRoles}
                    pinRoles={pinRoles}
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
                ) : (
                  <></>
                )}
              </MessageBody>

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
