import React, { useContext } from 'react';
import { css } from '@emotion/react';
import { Avatar } from '../Avatar';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';
import RCContext from '../../context/RCInstance';

const MessageAvatarContainer = ({
  message,
  sequential,
  isStarred,
  isPinned,
}) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };
  const MessageAvatarContainerCss = css`
    margin: 3px;
    width: 2.25em;
    max-height: 2.25em;
    display: flex;
    justify-content: flex-end;
  `;

  return (
    <Box css={MessageAvatarContainerCss}>
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
