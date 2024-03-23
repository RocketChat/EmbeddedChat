import { css } from '@emotion/react';
import React from 'react';
import { appendClassNames } from '../../lib/appendClassNames';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';

export const AvatarContainer = ({
  title,
  children,
  className = '',
  style = {},
  ...props
}) => {
  const AvatarContainerCSS = css`
    display: inline-flex;
    vertical-align: middle;
    cursor: pointer;
  `;
  const { classNames, styleOverrides } = useComponentOverrides(
    'AvatarContainer',
    className,
    style
  );
  props.className = appendClassNames('ec-avatar-container', [classNames]);

  props.style = styleOverrides;

  return (
    <Box is="figure" css={AvatarContainerCSS} aria-label={title} {...props}>
      {children}
    </Box>
  );
};
