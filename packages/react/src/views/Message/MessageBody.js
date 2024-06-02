import React from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../../components/Box';
import { appendClassNames } from '../../lib/appendClassNames';
import { MessageBodyStyles as styles } from './Message.styles';
import useBubbleStyles from './BubbleVariant/useBubbleStyles';

export const MessageBody = ({
  children,
  className = '',
  style = {},
  isBubble,
  isText,
  sequential,
  lastSequential,
  isMe,
  ...props
}) => {
  const { styleOverrides, classNames } = useComponentOverrides(
    'MessageBody',
    className,
    style
  );

  const { getBubbleStyles } = useBubbleStyles(isMe, sequential, lastSequential);

  return (
    <Box
      css={
        isBubble
          ? getBubbleStyles(isText ? 'messageBody' : 'attachmentBody')
          : styles.messageBody
      }
      className={appendClassNames('ec-message-body', classNames)}
      style={styleOverrides}
      {...props}
    >
      {children}
    </Box>
  );
};
