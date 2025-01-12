import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Icon, Avatar } from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { RoomMemberItemStyles as styles } from './RoomMembers.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';
import { useUserStore } from '../../store';

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
        console.error('Error fetching user status:', err);
      }
    };

    getStatus();
  }, [RCInstance]);
  const setExclusiveState = useSetExclusiveState();
  const { setShowCurrentUserInfo, setCurrentUser } = useUserStore((state) => ({
    setShowCurrentUserInfo: state.setShowCurrentUserInfo,
    setCurrentUser: state.setCurrentUser,
  }));

  const handleShowUserInfo = () => {
    setExclusiveState(setShowCurrentUserInfo);
    setCurrentUser(user);
  };
  return (
    <Box
      css={styles.container}
      style={{ cursor: 'pointer' }}
      onClick={handleShowUserInfo}
    >
      <Avatar
        url={avatarUrl}
        alt="avatar"
        size="1.5rem"
        css={css`
          margin-right: 0.5rem;
        `}
      />

      <Box
        is="span"
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        {userStatus && (
          <Icon name={userStatus} size="1.25rem" css={styles.icon} />
        )}
        <Box is="span">
          {user.name} ({user.username})
        </Box>
      </Box>
    </Box>
  );
};

export default RoomMemberItem;

RoomMemberItem.propTypes = {
  user: PropTypes.object,
};
