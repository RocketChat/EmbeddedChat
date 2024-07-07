import React from 'react';
import { Box } from '@embeddedchat/ui-elements';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { useMessageBodyContainerStyles } from './Message.styles';

const MessageBodyContainer = ({
  children,
  className = '',
  variantStyles = {},
  style = {},
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageBodyContainer',
    className,
    style
  );

  const styles = useMessageBodyContainerStyles();

  return (
    <Box
      css={variantStyles.messageBodyContainer || styles.bodyContainer}
      className={appendClassNames('ec-message-body-container', classNames)}
      style={styleOverrides}
    >
      {children}
    </Box>
  );
};

export default MessageBodyContainer;
