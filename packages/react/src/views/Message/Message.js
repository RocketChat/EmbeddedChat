import React, { memo, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Attachments } from '../AttachmentHandler';
import { Markdown } from '../Markdown';
import MessageHeader from './MessageHeader';
import { useMessageStore, useUserStore, useThemeStore } from '../../store';
import RCContext from '../../context/RCInstance';
import { Box } from '../../components/Box';
import { UiKitComponent, kitContext, UiKitMessage } from '../uiKit';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { MessageBody } from './MessageBody';
import { MessageReactions } from './MessageReactions';
import { MessageMetrics } from './MessageMetrics';
import { MessageToolbox } from './MessageToolbox';
import { MessageDivider } from './MessageDivider';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import MessageAvatarContainer from './MessageAvatarContainer';
import MessageBodyContainer from './MessageBodyContainer';
import { LinkPreview } from '../LinkPreview';
import { useMessageStyles } from './Message.styles';
import { useBubbleMessageStyles } from './BubbleVariant.styles';
import { Icon } from '../../components/Icon';
import { useCustomTheme } from '../../hooks/useCustomTheme';

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
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'Message',
    [message.messageParentBox, className],
    style
  );
  const { colors } = useCustomTheme();

  const styles = useMessageStyles();
  const bubbleStyle = useBubbleMessageStyles();
  const variant = useThemeStore((state) => state.messageVariant);

  const { RCInstance } = useContext(RCContext);
  const authenticatedUserId = useUserStore((state) => state.userId);
  const authenticatedUserUsername = useUserStore((state) => state.username);
  const [setMessageToReport, toggleShowReportMessage] = useMessageStore(
    (state) => [state.setMessageToReport, state.toggleShowReportMessage]
  );
  const dispatchToastMessage = useToastBarDispatch();
  const { editMessage, setEditMessage } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
  }));

  const setQuoteMessage = useMessageStore((state) => state.setQuoteMessage);

  const openThread = useMessageStore((state) => state.openThread);

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

  const context = useMemo(
    () => ({
      action: async ({ actionId, value, blockId, appId }) => {
        await RCInstance?.triggerBlockAction({
          blockId,
          actionId,
          value,
          mid: message._id,
          rid: RCInstance.rid,
          appId,
          container: {
            type: 'message',
            id: message._id,
          },
        });
      },
      appId: message.blocks && message.blocks[0] && message.blocks[0].appId,
      rid: RCInstance.rid,
    }),
    [RCInstance, message._id, message.blocks]
  );

  const isStarred = message.starred?.find((u) => u._id === authenticatedUserId);
  const isPinned = message.pinned;
  const shouldShowHeader = !sequential || (!showAvatar && isStarred);
  return (
    <>
      {variant === 'flat' && (
        <Box
          className={appendClassNames('ec-message', classNames)}
          css={[
            styles.main,
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
          <MessageBodyContainer>
            {shouldShowHeader && (
              <MessageHeader message={message} isRoles={showRoles} />
            )}
            {!message.t ? (
              <>
                <MessageBody
                  css={message.isPending && styles.pendingMessageBody}
                >
                  {message.attachments && message.attachments.length > 0 ? (
                    <>
                      <Markdown body={message} isReaction={false} />
                      <Attachments attachments={message.attachments} />
                    </>
                  ) : (
                    <Markdown body={message} isReaction={false} />
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
                          />
                        )
                    )}

                  {message.blocks && (
                    <kitContext.Provider value={context} mid={message.mid}>
                      <UiKitComponent
                        render={UiKitMessage}
                        blocks={message.blocks}
                      />
                    </kitContext.Provider>
                  )}
                </MessageBody>

                <MessageReactions
                  authenticatedUserUsername={authenticatedUserUsername}
                  message={message}
                  handleEmojiClick={handleEmojiClick}
                />
              </>
            ) : (
              <>
                {message.attachments && (
                  <Attachments attachments={message.attachments} />
                )}
              </>
            )}
            {message.tcount && type !== 'thread' ? (
              <MessageMetrics
                message={message}
                handleOpenThread={handleOpenThread}
              />
            ) : null}
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
              />
            ) : (
              <></>
            )}
          </MessageBodyContainer>
        </Box>
      )}

      {variant === 'bubble' && (
        <Box
          className={appendClassNames('ec-bubble-message', classNames)}
          css={[
            bubbleStyle.main,
            message.u._id === authenticatedUserId && bubbleStyle.me,
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
          <Box
            css={[
              bubbleStyle.body,
              message.u._id === authenticatedUserId && bubbleStyle.bodyMe,
            ]}
          >
            {shouldShowHeader && (
              <MessageHeader
                message={message}
                isRoles={showRoles}
                showName={!(message.u._id === authenticatedUserId)}
              />
            )}
            {!message.t ? (
              <>
                {message.md && (
                  <Box
                    className="ec-bubble"
                    css={[
                      bubbleStyle.messageContainer,
                      message.u._id === authenticatedUserId &&
                        bubbleStyle.messageContainerMe,
                      sequential && bubbleStyle.sequential,
                      message.u._id === authenticatedUserId &&
                        sequential &&
                        bubbleStyle.sequentialMe,
                      lastSequential && bubbleStyle.lastSequential,
                      message.u._id === authenticatedUserId &&
                        lastSequential &&
                        bubbleStyle.lastSequentialMe,
                    ]}
                  >
                    <Markdown body={message} isReaction={false} />

                    {showToolbox ? (
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
                        isBubble={{
                          me: message.u._id === authenticatedUserId,
                        }}
                      />
                    ) : (
                      <></>
                    )}
                  </Box>
                )}
                <Box
                  className="ec-bubble-attachment"
                  css={[
                    bubbleStyle.attachmentContainer,
                    message.u._id === authenticatedUserId &&
                      bubbleStyle.attachmentContainerMe,
                    sequential && bubbleStyle.sequential,
                    message.u._id === authenticatedUserId &&
                      sequential &&
                      bubbleStyle.sequentialMe,
                    lastSequential && bubbleStyle.lastSequential,
                    message.u._id === authenticatedUserId &&
                      lastSequential &&
                      bubbleStyle.lastSequentialMe,
                  ]}
                >
                  {message.attachments && message.attachments.length > 0 && (
                    <Attachments
                      attachments={message.attachments}
                      variant="bubble"
                    />
                  )}

                  {showToolbox ? (
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
                      isBubble={{
                        me: message.u._id === authenticatedUserId,
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </Box>

                {isLinkPreview &&
                  message.urls &&
                  message.urls.map(
                    (url, index) =>
                      url.meta && (
                        <LinkPreview
                          key={index}
                          url={url.url}
                          meta={url.meta}
                          variant="bubble"
                        />
                      )
                  )}

                {message.blocks && (
                  <kitContext.Provider value={context} mid={message.mid}>
                    <UiKitComponent
                      render={UiKitMessage}
                      blocks={message.blocks}
                    />
                  </kitContext.Provider>
                )}

                <MessageReactions
                  authenticatedUserUsername={authenticatedUserUsername}
                  message={message}
                  handleEmojiClick={handleEmojiClick}
                />

                {message.tcount && type !== 'thread' ? (
                  <Box
                    css={[
                      bubbleStyle.metricContainer,
                      message.u._id === authenticatedUserId &&
                        bubbleStyle.metricContainerMe,
                    ]}
                  >
                    <Icon
                      name="arc"
                      size="30"
                      fill="none"
                      color={`${colors.accent}`}
                      css={
                        message.u._id === authenticatedUserId &&
                        bubbleStyle.flipIcon
                      }
                    />
                    <MessageMetrics
                      variant="bubble"
                      message={message}
                      handleOpenThread={handleOpenThread}
                    />
                  </Box>
                ) : null}
              </>
            ) : (
              <>
                {message.attachments && (
                  <Attachments attachments={message.attachments} />
                )}
              </>
            )}
          </Box>
        </Box>
      )}

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
