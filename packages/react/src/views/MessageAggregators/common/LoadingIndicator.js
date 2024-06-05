import React from 'react';
import { Box } from '../../../components/Box';
import { Throbber } from '../../../components/Throbber';
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
