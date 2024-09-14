import React from 'react';
import {
  Box,
  Icon,
  useComponentOverrides,
  useTheme,
} from '@embeddedchat/ui-elements';
import useChannelStateStyles from './ChannelState.styles';

const ChannelState = ({
  className = '',
  style = {},
  status,
  iconName,
  instructions,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ChannelState');
  const { theme } = useTheme();
  const styles = useChannelStateStyles(theme);
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
