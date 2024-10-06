import React from 'react';
import { Box, Throbber } from '@embeddedchat/ui-elements';
import useMessageAggregatorStyles from './MessageAggregator.styles';

const LoadingIndicator = () => {
  const styles = useMessageAggregatorStyles();
  return (
    <Box css={styles.centerColumnStyles}>
      <Throbber />
    </Box>
  );
};

export default LoadingIndicator;
