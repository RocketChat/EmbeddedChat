import React, { memo, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { css } from '@emotion/react';
import { Attachments } from '../Attachments';
import { Markdown } from '../Markdown';
import MessageHeader from './MessageHeader';
import classes from './Message.module.css';
import { useMessageStore, useUserStore } from '../../store';
import RCContext from '../../context/RCInstance';
import { Box } from '../Box';
import { UiKitComponent, kitContext, UiKitMessage } from '../uiKit';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { MessageBody } from './MessageBody';
import { MessageReactions } from './MessageReactions';
import { MessageMetrics } from './MessageMetrics';
import { MessageToolbox } from './MessageToolbox';
import { MessageDivider } from './MessageDivider';
import { useToastBarDispatch } from '../../hooks/useToastBarDispatch';
import MessageAvatarContainer from './MessageAvatarContainer';
import MessageBodyContainer from './MessageBodyContainer';

const MessageCss = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-top: 0.5rem;
  -webkit-padding-before: 0.5rem;
  padding-block-start: 0.5rem;
  padding-bottom: 0.25rem;
  -webkit-padding-after: 0.25rem;
  padding-block-end: 0.25rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  padding-inline: 1.25rem;
  &:hover {
    background: #f2f3f5;
  }
`;
const MessageEditingCss = css`
  background-color: #fff8e0;
  &:hover {
    background-color: #fff8e0;
  }
`;

const Message = ({
  message,
  variant = 'default',
  sequential = false,
  newDay = false,
  showAvatar = false,
  className = '',
  style = {},
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'Message',
    [message.messageParentBox, className],
    style
  );
  const { RCInstance } = useContext(RCContext);
  const authenticatedUserId = useUserStore((state) => state.userId);
  const authenticatedUserUsername = useUserStore((state) => state.username);
  const [setMessageToReport, toggletoggleShowReportMessage] = useMessageStore(
    (state) => [state.setMessageToReport, state.toggleShowReportMessage]
  );
  const dispatchToastMessage = useToastBarDispatch();
  const { editMessage, setEditMessage } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
  }));
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
  const shouldShowHeader = !sequential || (!showAvatar && isStarred);
  return (
    <>
      <Box
        className={appendClassNames('ec-message', classNames)}
        css={[MessageCss, editMessage._id === message._id && MessageEditingCss]}
        isEditing={editMessage.id === message._id}
        isPending={message.isPending}
        style={styleOverrides}
      >
        {showAvatar && (
          <MessageAvatarContainer
            message={message}
            sequential={sequential}
            isStarred={isStarred}
          />
        )}
        <MessageBodyContainer>
          {shouldShowHeader && <MessageHeader message={message} />}
          {!message.t ? (
            <>
              <MessageBody
                className={message.isPending ? classes.PendingMessageBody : ''}
              >
                {message.attachments && message.attachments.length > 0 ? (
                  <>
                    <Markdown body={message} isReaction={false} />
                    <Attachments attachments={message.attachments} />
                  </>
                ) : (
                  <Markdown body={message} isReaction={false} />
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
          {message.tcount && variant !== 'thread' ? (
            <MessageMetrics
              message={message}
              handleOpenThread={handleOpenThread}
            />
          ) : null}
          {!message.t ? (
            <MessageToolbox
              message={message}
              isEditing={editMessage._id === message._id}
              authenticatedUserId={authenticatedUserId}
              handleDeleteMessage={handleDeleteMessage}
              handleOpenThread={handleOpenThread}
              handleStarMessage={handleStarMessage}
              handlePinMessage={handlePinMessage}
              handleEditMessage={() => {
                if (editMessage._id === message._id) {
                  setEditMessage({});
                } else {
                  setEditMessage(message);
                }
              }}
              handleEmojiClick={handleEmojiClick}
              handlerReportMessage={() => {
                setMessageToReport(message._id);
                toggletoggleShowReportMessage();
              }}
              isThreadMessage={variant === 'thread'}
            />
          ) : (
            <></>
          )}
        </MessageBodyContainer>
      </Box>
      {newDay ? (
        <MessageDivider>
          {format(new Date(message.ts), 'MMMM d, yyyy')}
        </MessageDivider>
      ) : null}
    </>
  );
};

Message.propTypes = {
  message: PropTypes.any,
  sequential: PropTypes.bool,
  newDay: PropTypes.bool,
  variant: PropTypes.oneOf(['thread', 'default']),
  showAvatar: PropTypes.bool,
};

export default memo(Message);
