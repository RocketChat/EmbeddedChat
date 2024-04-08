import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RCContext from '../../context/RCInstance';
import { Icon } from '../Icon';

const RoomMemberItem = ({ user, host }) => {
  const { RCInstance } = useContext(RCContext);
  const [userStatus, setUserStatus] = useState('');
  const avatarUrl = new URL(`avatar/${user.username}`, host).toString();

  useEffect(() => {
    const getStatus = async () => {
      try {
        const res = await RCInstance.getUserStatus(user._id);
        if (res.success) {
          setUserStatus(res.status);
        }
      } catch (err) {
        console.error('Error fetching user status', err);
      }
    };

    getStatus();
  }, [RCInstance]);

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
        {userStatus === 'online' && (
          <Icon
            name="online"
            size="1.25rem"
            style={{ padding: '0.125em', marginRight: '0.5rem', alignSelf: 'center' }}
          />
        )}
        {userStatus === 'offline' && (
          <Icon
            name="offline"
            size="1.25rem"
            style={{ padding: '0.125em', marginRight: '0.5rem', alignSelf: 'center' }}
          />
        )}
        {userStatus === 'away' && (
          <Icon
            name="away"
            size="1.25rem"
            style={{ padding: '0.125em', marginRight: '0.5rem', alignSelf: 'center' }}
          />
        )}
        {userStatus === 'busy' && (
          <Icon
            name="busy"
            size="1.25rem"
            style={{ padding: '0.125em', marginRight: '0.5rem', alignSelf: 'center' }}
          />
        )}
        <span>{user.username}</span>
      </span>
    </div>
  );
};

export default RoomMemberItem;

RoomMemberItem.propTypes = {
  user: PropTypes.object,
};
