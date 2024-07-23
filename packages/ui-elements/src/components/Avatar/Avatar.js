import React, { useState } from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { AvatarContainer } from './AvatarContainer';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { useAvatarStyles } from './Avatar.styles';

export const Avatar = ({
  size = '2.25rem',
  className = '',
  style = {},
  url,
  fallbackIcon = 'avatar',
  onClick = () => {},
  ...props
}) => {
  const [imgError, setImgError] = useState(false);
  const styles = useAvatarStyles();
  const { classNames, styleOverrides } = useComponentOverrides(
    'Avatar',
    className,
    style
  );

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
          onClick={onClick}
        />
      ) : (
        <Box css={styles.fallbackContainer(size)}>
          <Icon name={fallbackIcon} size="1.25rem" />
        </Box>
      )}
    </AvatarContainer>
  );
};
