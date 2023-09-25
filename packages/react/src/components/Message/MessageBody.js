import React from 'react';
import { css } from '@emotion/react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { appendClassNames } from '../../lib/appendClassNames';

const MessageBodyCss = css`
  letter-spacing: 0rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  flex-shrink: 1;
  transition: opacity 0.3s linear;
  word-break: break-word;
  opacity: 1;
  color: #2f343d;
  margin-top: 0.125rem;
  margin-bottom: 0.125rem;
  margin-block: 0.125rem;
`;

export const MessageBody = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageBody',
    className,
    style
  );
  return (
    <Box
      css={MessageBodyCss}
      className={appendClassNames('ec-message-body', classNames)}
      style={styleOverrides}
      {...props}
    >
      <p>{children}</p>
    </Box>
  );
};
