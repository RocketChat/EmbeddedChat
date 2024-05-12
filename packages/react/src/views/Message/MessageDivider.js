import React from 'react';
import { appendClassNames } from '../../lib/appendClassNames';
import { Box } from '../../components/Box';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { MessageDividerStyles as styles } from './Message.styles';

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
            css={styles.dividerwrapper}
            className="ec-message-divider-content"
          >
            {children}
          </Box>{' '}
        </>
      )}
    </Box>
  );
};
