import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { isSameDay, format, formatDistance } from 'date-fns';
import {
  Box,
  Button,
  Icon,
  Message,
  MessageReactions,
  MessageToolbox,
  MessageDivider,
  Avatar,
  MessageMetricsItem,
  MessageMetrics,
  MessageMetricsReply,
} from '@rocket.chat/fuselage';
import Popup from 'reactjs-popup';
import { useMediaQuery } from '@rocket.chat/fuselage-hooks';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import Cookies from 'js-cookie';
import { EmojiPicker } from '../EmojiPicker/index';
import RCContext from '../../context/RCInstance';
import {
  useMessageStore,
  useToastStore,
  useUserStore,
  useMemberStore,
  useSearchMessageStore,
  useChannelStore,
} from '../../store';
import { isSameUser, serializeReactions } from '../../lib/reaction';
import { Attachments } from '../Attachments';
import { RC_USER_ID_COOKIE } from '../../lib/constant';
import RoomMembers from '../RoomMembers/RoomMember';
import MessageReportWindow from '../ReportMessage/MessageReportWindow';
import { Markdown } from '../Markdown';
import MessageHeader from './MessageHeader';
import isMessageSequential from '../../lib/isMessageSequential';
import SearchMessage from '../SearchMessage/SearchMessage';

import Roominfo from '../RoomInformation/RoomInformation';
import classes from './MessageList.module.css';

const MessageList = ({ messages, handleGoBack }) => {
  const { RCInstance, ECOptions } = useContext(RCContext);
  const authenticatedUserId = Cookies.get(RC_USER_ID_COOKIE);
  const authenticatedUserUsername = useUserStore((state) => state.username);

  const isSmallScreen = useMediaQuery('(max-width: 992px)');
  const dispatchToastMessage = useToastBarDispatch();

  const filtered = useMessageStore((state) => state.filtered);
  const toastPosition = useToastStore((state) => state.position);
  const showSearch = useSearchMessageStore((state) => state.showSearch);
  const showChannelinfo = useChannelStore((state) => state.showChannelinfo);

  const { editMessage, setEditMessage } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
  }));

  const showMembers = useMemberStore((state) => state.showMembers);
  const members = useMemberStore((state) => state.members);
  const showAvatar = useUserStore((state) => state.showAvatar);

  const showReportMessage = useMessageStore((state) => state.showReportMessage);

  const [messageToReport, setMessageToReport, toggletoggleShowReportMessage] =
    useMessageStore((state) => [
      state.messageToReport,
      state.setMessageToReport,
      state.toggleShowReportMessage,
    ]);

  const openThread = useMessageStore((state) => state.openThread);

  const handleStarMessage = async (message) => {
    const isStarred =
      message.starred &&
      message.starred.find((u) => u._id === authenticatedUserId);
    if (!isStarred) {
      await RCInstance.starMessage(message._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message starred',
        position: toastPosition,
      });
    } else {
      await RCInstance.unstarMessage(message._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message unstarred',
        position: toastPosition,
      });
    }
  };

  const handlePinMessage = async (message) => {
    const isPinned = message.pinned;
    const pinOrUnpin = isPinned
      ? await RCInstance.unpinMessage(message._id)
      : await RCInstance.pinMessage(message._id);
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

  const handleDeleteMessage = async (message) => {
    const res = await RCInstance.deleteMessage(message._id);

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

  const handleOpenThread = (message) => async () => {
    openThread(message);
  };

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };

  return (
    <>
      {messages &&
        messages.map((msg, index, arr) => {
          const prev = arr[index + 1];
          const newDay = isMessageNewDay(msg, prev);
          const sequential = isMessageSequential(msg, prev, 300);

          return (
            msg && (
              <Box className={classes.messageParentBox} key={msg._id}>
                <Message
                  key={msg._id}
                  isEditing={editMessage.id === msg._id}
                  className={classes.messageBody}
                >
                  <Message.Container>
                    {newDay && (
                      <MessageDivider>
                        {format(new Date(msg.ts), 'MMMM d, yyyy')}
                      </MessageDivider>
                    )}
                    <Box display="flex">
                      {showAvatar && (
                        <Box margin="3px">
                          <Avatar
                            url={getUserAvatarUrl(msg.u.username)}
                            size="x36"
                            alt="avatar"
                          />
                        </Box>
                      )}
                      <Box margin="5px">
                        {!sequential && <MessageHeader msg={msg} />}
                        {!msg.t ? (
                          <>
                            <Message.Body
                              className={
                                msg.isPending ? classes.PendingMessageBody : ''
                              }
                            >
                              {msg.attachments && msg.attachments.length > 0 ? (
                                <>
                                  <Markdown body={msg} isReaction={false} />
                                  <Attachments attachments={msg.attachments} />
                                </>
                              ) : (
                                <Markdown body={msg} isReaction={false} />
                              )}
                            </Message.Body>

                            <MessageReactions>
                              {msg.reactions &&
                                serializeReactions(msg.reactions).map(
                                  (reaction) => (
                                    <MessageReactions.Reaction
                                      key={reaction.name}
                                      mine={isSameUser(
                                        reaction,
                                        authenticatedUserUsername
                                      )}
                                      onClick={() =>
                                        handleEmojiClick(
                                          reaction,
                                          msg,
                                          !isSameUser(
                                            reaction,
                                            authenticatedUserUsername
                                          )
                                        )
                                      }
                                    >
                                      <Markdown
                                        body={reaction.name}
                                        isReaction
                                      />
                                      <p>{reaction.count}</p>
                                    </MessageReactions.Reaction>
                                  )
                                )}
                            </MessageReactions>
                          </>
                        ) : (
                          <>
                            {msg.attachments && (
                              <Attachments attachments={msg.attachments} />
                            )}
                          </>
                        )}
                        {!msg.t && msg.tcount && ECOptions.enableThreads ? (
                          <MessageMetrics>
                            <MessageMetricsReply
                              onClick={handleOpenThread(msg)}
                            >
                              Reply
                            </MessageMetricsReply>
                            <MessageMetricsItem title="Replies">
                              <MessageMetricsItem.Icon name="thread" />
                              <MessageMetricsItem.Label>
                                {msg.tcount}
                              </MessageMetricsItem.Label>
                            </MessageMetricsItem>
                            {!!msg.tcount && (
                              <MessageMetricsItem title="Participants">
                                <MessageMetricsItem.Icon name="user" />
                                <MessageMetricsItem.Label>
                                  {msg.replies.length}
                                </MessageMetricsItem.Label>
                              </MessageMetricsItem>
                            )}
                            <MessageMetricsItem
                              title={new Date(msg.tlm).toLocaleString()}
                            >
                              <MessageMetricsItem.Icon name="clock" />
                              <MessageMetricsItem.Label>
                                {formatDistance(new Date(msg.tlm), new Date(), {
                                  addSuffix: true,
                                })}
                              </MessageMetricsItem.Label>
                            </MessageMetricsItem>
                          </MessageMetrics>
                        ) : null}
                      </Box>
                    </Box>
                  </Message.Container>
                  {!msg.t ? (
                    <MessageToolbox.Wrapper>
                      <MessageToolbox>
                        <MessageToolbox.Item
                          icon="thread"
                          onClick={handleOpenThread(msg)}
                        />
                        <MessageToolbox.Item
                          icon={`${
                            msg.starred &&
                            msg.starred.find(
                              (u) => u._id === authenticatedUserId
                            )
                              ? 'star-filled'
                              : 'star'
                          }`}
                          onClick={() => handleStarMessage(msg)}
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
                              handleEmojiClick(e, msg, true)
                            }
                          />
                        </Popup>
                        <MessageToolbox.Item
                          icon="pin"
                          onClick={() => handlePinMessage(msg)}
                        />
                        {msg.u._id === authenticatedUserId && (
                          <>
                            <MessageToolbox.Item
                              icon="edit"
                              onClick={() => {
                                setEditMessage({ msg: msg.msg, id: msg._id });
                              }}
                            />
                            <MessageToolbox.Item
                              icon="trash"
                              color="danger"
                              onClick={() => handleDeleteMessage(msg)}
                            />
                          </>
                        )}
                        <MessageToolbox.Item
                          icon="report"
                          color="danger"
                          onClick={() => {
                            setMessageToReport(msg._id);
                            toggletoggleShowReportMessage();
                          }}
                        />
                      </MessageToolbox>
                    </MessageToolbox.Wrapper>
                  ) : (
                    <></>
                  )}
                </Message>
              </Box>
            )
          );
        })}
      {filtered && (
        <Box>
          <Button small onClick={handleGoBack}>
            <Icon mie="x4" name="back" size="x20" color="danger" />
            <p style={{ display: 'inline' }}>Go Back</p>
          </Button>
        </Box>
      )}
      {showMembers && <RoomMembers members={members} />}
      {showReportMessage && <MessageReportWindow messageId={messageToReport} />}
      {showSearch && <SearchMessage />}
      {showChannelinfo && <Roominfo />}
    </>
  );
};

export default MessageList;

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape),
  handleGoBack: PropTypes.func,
};
