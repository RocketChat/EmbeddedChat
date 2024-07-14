import React from 'react';
import {
  Box,
} from '@embeddedchat/ui-elements';

import { useMessageDividerStyles } from './Message.styles';

export const MessageDivider = ({
  children,
  ...props
}) => {

  const styles = useMessageDividerStyles();
  return (
    <Box
      role="separator"
      css={styles.divider}
      className='ec-message-divider'
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
  );
};
