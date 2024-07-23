import React from 'react';
import { css } from '@emotion/react';
import { Box, Icon } from '@embeddedchat/ui-elements';
import useMessageAggregatorStyles from './MessageAggregator.styles';

const NoMessagesIndicator = ({ iconName, message }) => {
  const styles = useMessageAggregatorStyles();
  return (
    <Box css={styles.centerColumnStyles}>
      <Icon
        name={iconName}
        size="3rem"
        css={css`
          padding: 0.5rem;
        `}
      />
      <Box
        is="span"
        css={css`
          font-size: 1.2rem;
          font-weight: bold;
        `}
      >
        {message}
      </Box>
    </Box>
  );
};

export default NoMessagesIndicator;
