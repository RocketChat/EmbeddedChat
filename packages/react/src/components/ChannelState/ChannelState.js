import React from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';
import useComponentOverrides from '../../theme/useComponentOverrides';
import styles from './ChannelState.styles';

const ChannelState = ({
  className = '',
  style = {},
  status,
  iconName,
  instructions,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ChannelState');
  return (
    <Box
      className={`ec-chat-info ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      css={styles.channelStateContainer}
    >
      <Box css={styles.channelStateMessage}>
        {iconName && <Icon name={iconName} size="10" />}
        <span>{status}</span>
      </Box>
      <Box>
        <span>{instructions}</span>
      </Box>
    </Box>
  );
};

export default ChannelState;