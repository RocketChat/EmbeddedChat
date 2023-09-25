import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { Message } from '@rocket.chat/fuselage';
import { useUserStore } from '../../store';
import { Icon } from '../Icon';

const MessageHeader = ({ message }) => {
  const roles = useUserStore((state) => state.roles);

  const userActions = () => {
    switch (message.t) {
      case 'ul':
        return 'left the channel';
      case 'uj':
        return 'joined the channel';
      case 'ru':
        return `removed @${message.message || message.msg}`;
      case 'au':
        return `added @${message.message || message.msg}`;
      case 'message_pinned':
        return 'Pinned a message:';
      case 'rm':
        return 'message removed';
      default:
        return '';
    }
  };

  const userRoles = roles[message.u.username]
    ? roles[message.u.username].roles
    : null;

  if (!message.t) {
    return (
      <Message.Header>
        <Message.Name>{message.u?.name}</Message.Name>
        <Message.Username>@{message.u.username}</Message.Username>
        {userRoles
          ? userRoles.map((role, index) => (
              <Message.Role key={index}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Message.Role>
            ))
          : null}
        <Message.Timestamp>
          {format(new Date(message.ts), 'h:mm a')}
        </Message.Timestamp>
        {message.editedAt && (
          <Icon
            style={{ marginInlineEnd: '0.4rem', opacity: 0.5 }}
            name="edit"
            size="1em"
          />
        )}
      </Message.Header>
    );
  }

  return (
    <Message.Header>
      <Message.Name>@{message.u.username} </Message.Name>
      <Message.Username style={{ marginLeft: '2px' }}>
        {userActions()}
      </Message.Username>
      <Message.Timestamp>
        {format(new Date(message.ts), 'h:mm a')}
      </Message.Timestamp>
    </Message.Header>
  );
};

export default MessageHeader;

MessageHeader.propTypes = {
  message: PropTypes.any,
};
