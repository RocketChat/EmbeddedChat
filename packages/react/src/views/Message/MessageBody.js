import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../../components/Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { MessageBodyStyles as styles } from './Message.styles';

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
      css={styles.messageBody}
      className={appendClassNames('ec-message-body', classNames)}
      style={styleOverrides}
      {...props}
    >
      {children}
    </Box>
  );
};
