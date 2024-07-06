import React from 'react';
import { appendClassNames } from '../../lib/appendClassNames';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { avatarContainerStyles as styles } from './Avatar.styles';

export const AvatarContainer = ({
  title,
  children,
  className = '',
  style = {},
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'AvatarContainer',
    className,
    style
  );
  props.className = appendClassNames('ec-avatar-container', [classNames]);

  props.style = styleOverrides;

  return (
    <Box is="figure" css={styles.avatarContainer} aria-label={title} {...props}>
      {children}
    </Box>
  );
};
