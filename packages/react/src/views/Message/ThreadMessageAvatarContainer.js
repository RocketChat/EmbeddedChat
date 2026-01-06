import React, { useContext } from 'react';
import {
  Box,
  Avatar,
  Icon,
  Tooltip,
  useTheme,
} from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { getMessageAvatarContainerStyles } from './Message.styles';

import useSetExclusiveState from '../../hooks/useSetExclusiveState';
import { useUserStore } from '../../store';

export const ThreadMessageAvatarContainer = ({
  message,
  sequential,
  isStarred,
  isPinned,
}) => {
  const { RCInstance } = useContext(RCContext);
  const { theme } = useTheme();
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };

  const setExclusiveState = useSetExclusiveState();
  const { setShowCurrentUserInfo, setCurrentUser } = useUserStore((state) => ({
    setShowCurrentUserInfo: state.setShowCurrentUserInfo, // don't think we need these both as we are opening a container
    setCurrentUser: state.setCurrentUser,
  }));

  return (
    <Box>
      <Avatar
        url={getUserAvatarUrl(message.u.username)}
        alt="avatar"
        size="1em"
      />
    </Box>
  );
};
