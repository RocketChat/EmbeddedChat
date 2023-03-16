import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Message as RCMessage,
  MessageReactions,
  MessageToolbox,
  MessageDivider,
  Avatar,
  MessageMetricsItem,
  MessageMetrics,
  MessageMetricsReply,
} from '@rocket.chat/fuselage';
import Popup from 'reactjs-popup';
import Cookies from 'js-cookie';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import { format, formatDistance } from 'date-fns';
import { useMediaQuery } from '@rocket.chat/fuselage-hooks';
import { isSameUser, serializeReactions } from '../../lib/reaction';
import { Attachments } from '../Attachments';
import { EmojiPicker } from '../EmojiPicker/index';
import { Markdown } from '../Markdown';
import MessageHeader from './MessageHeader';
import classes from './Message.module.css';
import { useMessageStore, useToastStore, useUserStore } from '../../store';
import RCContext from '../../context/RCInstance';
import { RC_USER_ID_COOKIE } from '../../lib/constant';

const Message = ({
  message,
  variant = 'default',
  sequential = false,
  newDay = false,
  showAvatar = false,
}) => {
  const { RCInstance } = useContext(RCContext);
  const authenticatedUserId = Cookies.get(RC_USER_ID_COOKIE);
  const authenticatedUserUsername = useUserStore((state) => state.username);
  const [setMessageToReport, toggletoggleShowReportMessage] = useMessageStore(
    (state) => [state.setMessageToReport, state.toggleShowReportMessage]
  );
  const dispatchToastMessage = useToastBarDispatch();
  const toastPosition = useToastStore((state) => state.position);
  const { editMessage, setEditMessage } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
  }));
  const openThread = useMessageStore((state) => state.openThread);
  const isSmallScreen = useMediaQuery('(max-width: 992px)');

  const handleStarMessage = async (msg) => {
    const isStarred =
      msg.starred && msg.starred.find((u) => u._id === authenticatedUserId);
    if (!isStarred) {
      await RCInstance.starMessage(msg._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message starred',
        position: toastPosition,
      });
    } else {
      await RCInstance.unstarMessage(msg._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message unstarred',
        position: toastPosition,
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
        position: toastPosition,
      });
    } else {
      dispatchToastMessage({
        type: 'success',
        message: isPinned ? 'Message unpinned' : 'Message pinned',
        position: toastPosition,
      });
    }
  };

  const handleDeleteMessage = async (msg) => {
    const res = await RCInstance.deleteMessage(msg._id);

    if (res.success) {
      dispatchToastMessage({
        type: 'success',
        message: 'Message deleted successfully',
        position: toastPosition,
      });
    } else {
      dispatchToastMessage({
        type: 'error',
        message: 'Error in deleting message',
        position: toastPosition,
      });
    }
  };

  const handleEmojiClick = async (e, msg, canReact) => {
    await RCInstance.reactToMessage(e.name, msg._id, canReact);
  };

  const handleOpenThread = (msg) => async () => {
    openThread(msg);
  };

  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };

  return (
    <Box className={classes.messageParentBox} key={message._id}>
      <RCMessage
        key={message._id}
        isEditing={editMessage.id === message._id}
        className={classes.messageBody}
        isPending={message.isPending}
      >
        <RCMessage.Container>
          {newDay && (
            <MessageDivider>
              {format(new Date(message.ts), 'MMMM d, yyyy')}
            </MessageDivider>
          )}
          <Box display="flex">
            {showAvatar && (
              <Box margin="3px">
                <Avatar
                  url={getUserAvatarUrl(message.u.username)}
                  size="x36"
                  alt="avatar"
                />
              </Box>
            )}
            <Box margin="5px">
              {!sequential && <MessageHeader message={message} />}
              {!message.t ? (
                <>
                  <RCMessage.Body
                    className={
                      message.isPending ? classes.PendingMessageBody : ''
                    }
                  >
                    {message.attachments && message.attachments.length > 0 ? (
                      <>
                        <Markdown body={message} isReaction={false} />
                        <Attachments attachments={message.attachments} />
                      </>
                    ) : (
                      <Markdown body={message} isReaction={false} />
                    )}
                  </RCMessage.Body>

                  <MessageReactions>
                    {message.reactions &&
                      serializeReactions(message.reactions).map((reaction) => (
                        <MessageReactions.Reaction
                          key={reaction.name}
                          mine={isSameUser(reaction, authenticatedUserUsername)}
                          onClick={() =>
                            handleEmojiClick(
                              reaction,
                              message,
                              !isSameUser(reaction, authenticatedUserUsername)
                            )
                          }
                        >
                          <Markdown body={reaction.name} isReaction />
                          <p>{reaction.count}</p>
                        </MessageReactions.Reaction>
                      ))}
                  </MessageReactions>
                </>
              ) : (
                <>
                  {message.attachments && (
                    <Attachments attachments={message.attachments} />
                  )}
                </>
              )}
              {message.tcount && variant !== 'thread' ? (
                <MessageMetrics>
                  <MessageMetricsReply onClick={handleOpenThread(message)}>
                    Reply
                  </MessageMetricsReply>
                  <MessageMetricsItem title="Replies">
                    <MessageMetricsItem.Icon name="thread" />
                    <MessageMetricsItem.Label>
                      {message.tcount}
                    </MessageMetricsItem.Label>
                  </MessageMetricsItem>
                  {!!message.tcount && (
                    <MessageMetricsItem title="Participants">
                      <MessageMetricsItem.Icon name="user" />
                      <MessageMetricsItem.Label>
                        {message.replies.length}
                      </MessageMetricsItem.Label>
                    </MessageMetricsItem>
                  )}
                  <MessageMetricsItem
                    title={new Date(message.tlm).toLocaleString()}
                  >
                    <MessageMetricsItem.Icon name="clock" />
                    <MessageMetricsItem.Label>
                      {formatDistance(new Date(message.tlm), new Date(), {
                        addSuffix: true,
                      })}
                    </MessageMetricsItem.Label>
                  </MessageMetricsItem>
                </MessageMetrics>
              ) : null}
            </Box>
          </Box>
        </RCMessage.Container>
        {!message.t ? (
          <MessageToolbox.Wrapper>
            <MessageToolbox>
              {variant !== 'thread' && (
                <MessageToolbox.Item
                  icon="thread"
                  onClick={handleOpenThread(message)}
                />
              )}
              <MessageToolbox.Item
                icon={`${
                  message.starred &&
                  message.starred.find((u) => u._id === authenticatedUserId)
                    ? 'star-filled'
                    : 'star'
                }`}
                onClick={() => handleStarMessage(message)}
              />
              <Popup
                trigger={
                  <MessageToolbox.Item
                    icon="emoji"
                    onClick={() => console.log('saf')}
                  />
                }
                position={isSmallScreen ? 'left top' : 'left center'}
              >
                <EmojiPicker
                  handleEmojiClick={(_, e) =>
                    handleEmojiClick(e, message, true)
                  }
                />
              </Popup>
              {variant !== 'thread' && (
                <MessageToolbox.Item
                  icon="pin"
                  onClick={() => handlePinMessage(message)}
                />
              )}
              {message.u._id === authenticatedUserId && (
                <>
                  <MessageToolbox.Item
                    icon="edit"
                    onClick={() => {
                      setEditMessage({
                        message: message.message,
                        id: message._id,
                      });
                    }}
                  />
                  <MessageToolbox.Item
                    icon="trash"
                    color="danger"
                    onClick={() => handleDeleteMessage(message)}
                  />
                </>
              )}
              <MessageToolbox.Item
                icon="report"
                color="danger"
                onClick={() => {
                  setMessageToReport(message._id);
                  toggletoggleShowReportMessage();
                }}
              />
            </MessageToolbox>
          </MessageToolbox.Wrapper>
        ) : (
          <></>
        )}
      </RCMessage>
    </Box>
  );
};

Message.propTypes = {
  message: PropTypes.any,
  sequential: PropTypes.bool,
  newDay: PropTypes.bool,
  variant: PropTypes.oneOf(['thread', 'default']),
  showAvatar: PropTypes.bool,
};

export default Message;
