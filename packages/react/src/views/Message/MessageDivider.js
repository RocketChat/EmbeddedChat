import React from 'react';
import {
  Box,
  useComponentOverrides,
  appendClassNames,
} from '@embeddedchat/ui-elements';

import { useMessageDividerStyles } from './Message.styles';

export const MessageDivider = ({
  children,
  unreadLabel,
  className = '',
  style = {},
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageDivider',
    className,
    style
  );
  const styles = useMessageDividerStyles();
  return (
    <Box
      role="separator"
      css={styles.divider}
      className={appendClassNames('ec-message-divider', classNames)}
      style={styleOverrides}
      {...props}
    >
      {children && (
        <>
          <Box css={styles.bar} className="ec-message-divider-bar" />
          <Box
            css={styles.dividerContent}
            className="ec-message-divider-content"
          >
            {children}
          </Box>{' '}
        </>
      )}
    </Box>
  );
};
