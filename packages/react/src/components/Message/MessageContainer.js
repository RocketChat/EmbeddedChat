import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { MessageContainerStyles as styles } from './Message.styles';

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
      css={styles.messageContainer}
      className={appendClassNames('ec-message-container', classNames)}
      style={styleOverrides}
      {...props}
    >
      {children}
    </Box>
  );
};
