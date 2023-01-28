import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Icon, Message } from '@rocket.chat/fuselage';

const MessageHeader = ({ msg }) => {
  const userActions = () => {
    switch (msg.t) {
      case 'ul':
        return 'left the channel';
      case 'uj':
        return 'joined the channel';
      case 'ru':
        return `removed @${msg.msg}`;
      case 'au':
        return `added @${msg.msg}`;
      case 'message_pinned':
        return 'Pinned a message:';
      default:
        return '';
    }
  };

  if (!msg.t) {
    return (
      <Message.Header>
        <Message.Name>{msg.u?.name}</Message.Name>
        <Message.Username>@{msg.u.username}</Message.Username>
        <Message.Timestamp>
          {format(new Date(msg.ts), 'h:mm a')}
        </Message.Timestamp>
        {msg.editedAt && <Icon mie="x4" opacity={0.5} name="edit" size="x16" />}
      </Message.Header>
    );
  }

  return (
    <Message.Header>
      <Message.Name>@{msg.u.username} </Message.Name>
      <Message.Username style={{ marginLeft: '2px' }}>
        {userActions()}
      </Message.Username>
      <Message.Timestamp>
        {format(new Date(msg.ts), 'h:mm a')}
      </Message.Timestamp>
    </Message.Header>
  );
};

export default MessageHeader;

MessageHeader.propTypes = {
  msg: PropTypes.any,
};
