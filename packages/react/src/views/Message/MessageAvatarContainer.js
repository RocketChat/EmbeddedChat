import React, { useContext } from 'react';
import { Box, Avatar, Icon, Tooltip } from '@embeddedchat/ui-elements';
import RCContext from '../../context/RCInstance';
import { useMessageAvatarContainerStyles } from './Message.styles';

const MessageAvatarContainer = ({
  message,
  sequential,
  isStarred,
  isPinned,
}) => {
  const { RCInstance } = useContext(RCContext);
  const styles = useMessageAvatarContainerStyles();
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };

  return (
    <Box css={styles.container}>
      {!sequential ? (
        <Avatar
          url={getUserAvatarUrl(message.u.username)}
          alt="avatar"
          size={message.t ? '1.2em' : '2.25em'}
          user={message?.u}
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
