import React from 'react';
import { css } from '@emotion/react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { appendClassNames } from '../../lib/appendClassNames';

const MessageBodyContainer = ({ children, className = '', style = {} }) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageBodyContainer',
    className,
    style
  );

  const classNameMBC = css`
    margin-left: 5px;
    position: relative;
    width: 100%;
  `;
  return (
    <Box
      css={classNameMBC}
      className={appendClassNames('ec-message-body-container', classNames)}
      style={styleOverrides}
    >
      {children}
    </Box>
  );
};

export default MessageBodyContainer;
