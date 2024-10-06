import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Box,
  useToastBarDispatch,
  useComponentOverrides,
  appendClassNames,
  useTheme,
} from '@embeddedchat/ui-elements';
import { Attachments } from '../AttachmentHandler';
import { Markdown } from '../Markdown';
import MessageHeader from './MessageHeader';
import { useMessageStore, useUserStore } from '../../store';
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

  const authenticatedUserId = useUserStore((state) => state.userId);
  const authenticatedUserUsername = useUserStore((state) => state.username);
  const [setMessageToReport, toggleShowReportMessage] = useMessageStore(
    (state) => [state.setMessageToReport, state.toggleShowReportMessage]
  );
  const setQuoteMessage = useMessageStore((state) => state.setQuoteMessage);
  const openThread = useMessageStore((state) => state.openThread);

  const dispatchToastMessage = useToastBarDispatch();
  const { editMessage, setEditMessage } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
  }));

  const isMe = message.u._id === authenticatedUserId;
  const theme = useTheme();
  const styles = getMessageStyles(theme);
  const bubbleStyles = useBubbleStyles(isMe);

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
  };

  const handlePinMessage = async (msg) => {
    const isPinned = msg.pinned;
    const pinOrUnpin = isPinned
      ? await RCInstance.unpinMessage(msg._id)
      : await RCInstance.pinMessage(msg._id);
    if (pinOrUnpin.error) {
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
  };

  const isStarred = message.starred?.find((u) => u._id === authenticatedUserId);
  const isPinned = message.pinned;
  const shouldShowHeader = !sequential || (!showAvatar && isStarred);

  return (
    <>
      <Box
        className={appendClassNames('ec-message', classNames)}
        css={[
          variantStyles.messageParent || styles.main,
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
        <MessageBodyContainer variantStyles={variantStyles}>
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
                    <Markdown body={message} isReaction={false} />
                    <Attachments
                      attachments={message.attachments}
                      variantStyles={variantStyles}
                    />
                  </>
                ) : (
                  <Markdown body={message} isReaction={false} />
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
                    handleQuoteMessage={() => setQuoteMessage(message)}
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
      {newDay && (
        <MessageDivider>
          {format(new Date(message.ts), 'MMMM d, yyyy')}
        </MessageDivider>
      )}
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
