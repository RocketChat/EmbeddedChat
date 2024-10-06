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

const MessageAvatarContainer = ({
  message,
  sequential,
  isStarred,
  isPinned,
}) => {
  const { RCInstance } = useContext(RCContext);
  const { theme } = useTheme();
  const styles = getMessageAvatarContainerStyles(theme);
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };

  const setExclusiveState = useSetExclusiveState();
  const { setShowCurrentUserInfo, setCurrentUser } = useUserStore((state) => ({
    setShowCurrentUserInfo: state.setShowCurrentUserInfo,
    setCurrentUser: state.setCurrentUser,
  }));

  const handleAvatarClick = () => {
    setExclusiveState(setShowCurrentUserInfo);
    setCurrentUser(message?.u);
  };

  return (
    <Box css={styles.container}>
      {!sequential ? (
        <Avatar
          url={getUserAvatarUrl(message.u.username)}
          alt="avatar"
          size={message.t ? '1.2em' : '2.25em'}
          onClick={handleAvatarClick}
        />
      ) : null}
      {isStarred && sequential ? (
        <Tooltip text="Starred" position="top">
          <Icon style={{ opacity: 0.5 }} name="star-filled" size="1.2em" />
        </Tooltip>
      ) : null}
      {isPinned && sequential ? (
        <Tooltip text="Pinned" position="top">
          <Icon style={{ opacity: 0.5 }} name="pin" size="1.2em" />
        </Tooltip>
      ) : null}
    </Box>
  );
};

export default MessageAvatarContainer;
