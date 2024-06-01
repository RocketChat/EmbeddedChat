import React from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../../components/Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { useThemeStore } from '../../store';
import useBubbleStyles from './BubbleVariant/useBubbleStyles';
import { useMessageBodyContainerStyles } from './Message.styles';

const MessageBodyContainer = ({
  children,
  className = '',
  style = {},
  isMe,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageBodyContainer',
    className,
    style
  );

  const styles = useMessageBodyContainerStyles();
  const isBubble = useThemeStore((state) => state.isBubble);
  const { getBubbleStyles } = useBubbleStyles(isMe);

  return (
    <Box
      css={
        isBubble
          ? getBubbleStyles('messageBodyContainer')
          : styles.bodyContainer
      }
      className={appendClassNames('ec-message-body-container', classNames)}
      style={styleOverrides}
    >
      {children}
    </Box>
  );
};

export default MessageBodyContainer;
