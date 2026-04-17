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
import { useChatLayoutStore, useUserStore } from '../../store';

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

  const openExclusivePanel = useChatLayoutStore(
    (state) => state.openExclusivePanel
  );
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const handleAvatarClick = () => {
    openExclusivePanel('showCurrentUserInfo');
    setCurrentUser(message?.u);
  };

  return (
    <Box css={styles.container}>
      {!sequential ? (
        <Avatar
          url={getUserAvatarUrl(message.u.username)}
          alt="avatar"
          size={
            window.matchMedia('(max-width: 768px)').matches
              ? message.t
                ? '1.2em'
                : '1.5em'
              : message.t
              ? '1.5em'
              : '2.25em'
          }
          onClick={handleAvatarClick}
        />
      ) : null}
      {isStarred && sequential ? (
        <Tooltip text="Starred" position="top">
          <Icon style={{ opacity: 0.5 }} name="star-filled" size="1.2em" />
        </Tooltip>
      ) : null}
      {message.editedAt && sequential ? (
        <Tooltip text="Edited" position="top">
          <Icon style={{ opacity: 0.5 }} name="edit" size="1.2em" />
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
