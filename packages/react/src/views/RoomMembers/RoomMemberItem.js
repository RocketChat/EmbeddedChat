import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Icon, Avatar, useTheme } from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { RoomMemberItemStyles } from './RoomMembers.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';
import { useUserStore } from '../../store';

const RoomMemberItem = ({
  user,
  host,
  isAdmin,
  isOwner,
  isModerator,
  isLeader,
}) => {
  const { RCInstance } = useContext(RCContext);
  const [userStatus, setUserStatus] = useState('');
  const avatarUrl = new URL(`avatar/${user.username}`, host).toString();

  const { theme } = useTheme();
  const styles = RoomMemberItemStyles(theme);

  const adminRole = isAdmin ? <Box css={styles.adminTag}>Admin</Box> : null;
  const ownerRole = isOwner ? <Box css={styles.ownerTag}>Owner</Box> : null;
  const moderatorRole = isModerator ? (
    <Box css={styles.moderatorTag}>Moderator</Box>
  ) : null;
  const leaderRole = isLeader ? <Box css={styles.leaderTag}>Leader</Box> : null;

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
          {user.name} ({user.username}) {adminRole} {ownerRole} {moderatorRole}{' '}
          {leaderRole}
        </Box>
      </Box>
    </Box>
  );
};

export default RoomMemberItem;

RoomMemberItem.propTypes = {
  user: PropTypes.object,
};
