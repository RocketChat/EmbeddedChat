import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Icon, Message } from '@rocket.chat/fuselage';
import { useUserStore } from '../../store';

const MessageHeader = ({ msg }) => {
  const roles = useUserStore((state) => state.roles);

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
      case 'rm':
        return 'message removed';
      default:
        return '';
    }
  };

  const userRoles = roles[msg.u.username] ? roles[msg.u.username].roles : null;

  if (!msg.t) {
    return (
      <Message.Header>
        <Message.Name>{msg.u?.name}</Message.Name>
        <Message.Username>@{msg.u.username}</Message.Username>
        {userRoles
          ? userRoles.map((role, index) => (
              <Message.Role key={index}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Message.Role>
            ))
          : null}
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
