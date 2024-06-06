import React, { useState } from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { AvatarContainer } from './AvatarContainer';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { useUserStore } from '../../store';
import { useAvatarStyles } from './Avatar.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

export const Avatar = ({
  size = '2.25rem',
  className = '',
  style = {},
  url,
  fallbackIcon = 'circle-cross',
  user,
  ...props
}) => {
  const [imgError, setImgError] = useState(false);
  const styles = useAvatarStyles();
  const { classNames, styleOverrides } = useComponentOverrides(
    'Avatar',
    className,
    style
  );

  const setExclusiveState = useSetExclusiveState();

  const setShowCurrentUserInfo = useUserStore(
    (state) => state.setShowCurrentUserInfo
  );
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  return (
    <AvatarContainer size={size} {...props}>
      {!imgError ? (
        <img
          role="presentation"
          src={`${url}`}
          css={styles.imageAvatar(size)}
          className={classNames}
          style={styleOverrides}
          onError={() => setImgError(true)}
          onClick={() => {
            setExclusiveState(setShowCurrentUserInfo);
            setCurrentUser(user);
          }}
        />
      ) : (
        <Box css={styles.fallbackContainer(size)}>
          <Icon name={fallbackIcon} size="1.25rem" />
        </Box>
      )}
    </AvatarContainer>
  );
};
