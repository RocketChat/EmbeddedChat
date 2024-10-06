import React from 'react';
import {
  Box,
  useComponentOverrides,
  appendClassNames,
  useTheme,
} from '@embeddedchat/ui-elements';

import { getMessageBodyContainerStyles } from './Message.styles';

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
  const { theme } = useTheme();
  const styles = getMessageBodyContainerStyles(theme);

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
