import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon';

const RoomMemberItem = ({ user, host }) => {
  const avatarUrl = new URL(`avatar/${user.username}`, host).toString();
  return (
    <div
      style={{
        width: '100%',
        paddingBottom: '8px',
        paddingTop: '8px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src={avatarUrl}
        alt="avatar"
        style={{ height: '1.5rem', marginRight: '0.5rem' }}
      />
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <Icon
          name="online"
          size="1.25rem"
          style={{ padding: '0.125em', marginRight: '0.5rem', alignSelf: 'center' }}
        />
        <span>{user.username}</span>
      </span>
    </div>
  );
};

export default RoomMemberItem;

RoomMemberItem.propTypes = {
  user: PropTypes.object,
};
