/* eslint-disable no-underscore-dangle */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { isSameDay, format } from 'date-fns';
import {
  Box,
  Button,
  Icon,
  Message,
  MessageReactions,
  MessageToolbox,
  MessageDivider,
} from '@rocket.chat/fuselage';
import Popup from 'reactjs-popup';
import { useMediaQuery } from '@rocket.chat/fuselage-hooks';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import Cookies from 'js-cookie';
import { EmojiPicker } from '../EmojiPicker/index';
import { Markdown } from '../Markdown/index';
import RCContext from '../../context/RCInstance';
import { useMessageStore, useToastStore, useUserStore } from '../../store';
import { isSameUser, serializeReactions } from '../../lib/reaction';
import { Attachments } from '../Attachments';
import { RC_USER_ID_COOKIE } from '../../lib/constant';

const MessageList = ({ messages, handleGoBack }) => {
  const { RCInstance } = useContext(RCContext);
  const authenticatedUserId = Cookies.get(RC_USER_ID_COOKIE);
  const authenticatedUserUsername = useUserStore((state) => state.username);

  const isSmallScreen = useMediaQuery('(max-width: 992px)');
  const dispatchToastMessage = useToastBarDispatch();

  const filtered = useMessageStore((state) => state.filtered);
  const toastPosition = useToastStore((state) => state.position);

  const { editMessage, setEditMessage } = useMessageStore((state) => ({
    editMessage: state.editMessage,
    setEditMessage: state.setEditMessage,
  }));

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

  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  const userActions = (type, msg) => {
    switch (type) {
      case 'ul':
        return 'left the channel';
      case 'uj':
        return 'joined the channel';
      case 'ru':
        return `removed @${msg.msg}`;
      case 'au':
        return `added @${msg.msg}`;
    }
  };

  return (
    <>
      {messages &&
        messages.map((msg, index, arr) => {
          const prev = arr[index + 1];
          const newDay = isMessageNewDay(msg, prev);

          return (
            (msg.msg || msg.attachments.length) && (
              <Message key={msg._id} isEditing={editMessage.id === msg._id}>
                <Message.Container>
                  {newDay && (
                    <MessageDivider>
                      {format(new Date(msg.ts), 'MMMM d, yyyy')}
                    </MessageDivider>
                  )}
                  {!msg.t ? (
                    <>
                      <Message.Header>
                        <Message.Name>{msg.u?.name}</Message.Name>
                        <Message.Username>@{msg.u.username}</Message.Username>
                        <Message.Timestamp>
                          {format(new Date(msg.ts), 'h:mm a')}
                        </Message.Timestamp>
                        {msg.editedAt && (
                          <Icon mie="x4" opacity={0.5} name="edit" size="x16" />
                        )}
                      </Message.Header>
                      <Message.Body>
                        {msg.attachments && msg.attachments.length > 0 ? (
                          <Attachments attachments={msg.attachments} />
                        ) : (
                          <Markdown body={msg.msg} />
                        )}
                      </Message.Body>
                      <MessageReactions>
                        {msg.reactions &&
                          serializeReactions(msg.reactions).map((reaction) => (
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
                              <Markdown body={reaction.name} />
                              <p>{reaction.count}</p>
                            </MessageReactions.Reaction>
                          ))}
                      </MessageReactions>
                    </>
                  ) : (
                    <Message.Header>
                      <Message.Name>@{msg.u.username} </Message.Name>
                      <Message.Username style={{ marginLeft: '2px' }}>
                        {userActions(msg.t, msg)}
                      </Message.Username>
                      <Message.Timestamp>
                        {format(new Date(msg.ts), 'h:mm a')}
                      </Message.Timestamp>
                    </Message.Header>
                  )}
                </Message.Container>
                {!msg.t ? (
                  <MessageToolbox.Wrapper>
                    <MessageToolbox>
                      <MessageToolbox.Item icon="thread" />
                      <MessageToolbox.Item
                        icon={`${
                          msg.starred &&
                          msg.starred.find((u) => u._id === authenticatedUserId)
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
                    </MessageToolbox>
                  </MessageToolbox.Wrapper>
                ) : (
                  <></>
                )}
              </Message>
            )
          );
        })}
      {filtered && (
        <Box>
          <Button small onClick={handleGoBack}>
            <Icon mie="x4" name="back" size="x20" />
            <p style={{ display: 'inline' }}>Go Back</p>
          </Button>
        </Box>
      )}
    </>
  );
};

export default MessageList;

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape),
  handleGoBack: PropTypes.func,
};
