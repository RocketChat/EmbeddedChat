import React from 'react';
import PropTypes from 'prop-types';

const RoomMemberItem = ({ user, host }) => (
  <div
    style={{
      width: '100%',
      paddingBottom: '8px',
      paddingTop: '8px',
      display: 'flex',
    }}
  >
    <img
      src={`${host}/avatar/${user.username}`}
      alt="avatar"
      style={{ height: '1.5rem', marginLeft: '0.5rem' }}
    />
    <span style={{ marginLeft: '1.2rem' }}>{user.username}</span>
  </div>
);

export default RoomMemberItem;

RoomMemberItem.propTypes = {
  user: PropTypes.object,
};
