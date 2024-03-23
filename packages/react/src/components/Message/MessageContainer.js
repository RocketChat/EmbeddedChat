import React from 'react';
import { css } from '@emotion/react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { appendClassNames } from '../../lib/appendClassNames';

const MessageContainerCss = css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 1px;
  margin-top: -0.125rem;
  margin-bottom: -0.125rem;
  margin-block: -0.125rem;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  margin-inline: 0.25rem;
  &:hover {
    background: #f2f3f5;
  }
`;

export const MessageContainer = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageContainer',
    className,
    style
  );
  return (
    <Box
      css={MessageContainerCss}
      className={appendClassNames('ec-message-container', classNames)}
      style={styleOverrides}
      {...props}
    >
      {children}
    </Box>
  );
};
