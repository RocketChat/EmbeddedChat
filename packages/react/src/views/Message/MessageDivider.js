import React from 'react';
import {
  Box,
  useComponentOverrides,
  appendClassNames,
  useTheme,
} from '@embeddedchat/ui-elements';

import {
  getMessageDividerStyles,
  getUnreadMessageDividerStyles,
} from './Message.styles';

export const MessageDivider = ({
  children,
  unreadLabel,
  unread = false,
  className = '',
  style = {},
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageDivider',
    className,
    style
  );
  const { theme, mode } = useTheme();
  const styles = unread
    ? getUnreadMessageDividerStyles(theme, mode)
    : getMessageDividerStyles(theme);
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
