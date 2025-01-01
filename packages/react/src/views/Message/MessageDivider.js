import React from 'react';
import {
  Box,
  useComponentOverrides,
  appendClassNames,
  useTheme,
} from '@embeddedchat/ui-elements';

import { getMessageDividerStyles } from './Message.styles';

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
  const { theme } = useTheme();
  const styles = getMessageDividerStyles(theme);

  const isUnread = unreadLabel !== undefined;

  return (
    <>
      {isUnread ? (
        <Box
          role="separator"
          css={styles.unreadDivider}
          className={appendClassNames('ec-message-divider', classNames)}
          style={styleOverrides}
          {...props}
        >
          <Box css={styles.unreadBar} className="ec-message-divider-bar" />
          <Box
            css={styles.unreadDividerContent}
            className="ec-message-divider-content"
          >
            {unreadLabel}
          </Box>
        </Box>
      ) : (
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
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
};
