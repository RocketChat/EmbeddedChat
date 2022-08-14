import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Icon,
  Message,
  MessageToolbox,
} from '@rocket.chat/fuselage';
import { EmojiPicker } from '../EmojiPicker/index';
import Popup from 'reactjs-popup';
import { Markdown } from '../Markdown/index';
import { useMediaQuery } from '@rocket.chat/fuselage-hooks';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import RCContext from '../../context/RCInstance';
import { useMessageStore } from '../../store';

const MessageList = ({ messages, handleGoBack }) => {
  const { RCInstance } = useContext(RCContext);

  const isSmallScreen = useMediaQuery('(max-width: 992px)');
  const dispatchToastMessage = useToastBarDispatch();

  const filtered = useMessageStore((state) => state.filtered);

  const handleEmojiClick = (_, e) => {
    let emoji = `:${e.name}:`;
    console.log(emoji);
  };

  const handleStarMessage = async (message) => {
    const isStarred =
      message.starred && message.starred.find((u) => u._id === message.u._id);
    console.log(isStarred);
    if (!isStarred) {
      await RCInstance.starMessage(message._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message starred',
      });
    } else {
      await RCInstance.unstarMessage(message._id);
      dispatchToastMessage({
        type: 'success',
        message: 'Message unstarred',
      });
    }
  };

  return (
    <>
      {messages &&
        messages.map((msg) => (
          <Message key={msg._id}>
            <Message.Container>
              <Message.Header>
                <Message.Name>{msg.u?.name}</Message.Name>
                <Message.Username>@{msg.u.username}</Message.Username>
                <Message.Timestamp>
                  {new Date(msg.ts).toDateString()}
                </Message.Timestamp>
              </Message.Header>
              <Message.Body>
                <Markdown body={msg.msg} />
              </Message.Body>
            </Message.Container>
            <MessageToolbox.Wrapper>
              <MessageToolbox>
                <MessageToolbox.Item icon="thread" />
                <MessageToolbox.Item
                  icon={`${
                    msg.starred && msg.starred.find((u) => u._id === msg.u._id)
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
                  <EmojiPicker handleEmojiClick={handleEmojiClick} />
                </Popup>
                <MessageToolbox.Item icon="pin" />
              </MessageToolbox>
            </MessageToolbox.Wrapper>
          </Message>
        ))}
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
  messages: PropTypes.arrayOf(PropTypes.object),
  handleGoBack: PropTypes.func,
};
