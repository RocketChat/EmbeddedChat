import React from 'react';
import { Box } from '../../components/Box';
import { Icon } from '../../components/Icon';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import useChannelStateStyles from './ChannelState.styles';

const ChannelState = ({
  className = '',
  style = {},
  status,
  iconName,
  instructions,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ChannelState');
  const styles = useChannelStateStyles();
  return (
    <Box
      className={`ec-chat-info ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      css={styles.channelStateContainer}
    >
      <Box css={styles.channelStateMessage}>
        {iconName && <Icon name={iconName} size="10" />}
        <Box is="span">{status}</Box>
      </Box>
      <Box>
        <Box is="span">{instructions}</Box>
      </Box>
    </Box>
  );
};

export default ChannelState;
