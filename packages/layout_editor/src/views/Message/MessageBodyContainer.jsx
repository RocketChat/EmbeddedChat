import React from "react";
import { Box } from "@embeddedchat/ui-elements";

import { getMessageBodyContainerStyles } from "./Message.styles";

const MessageBodyContainer = ({ children, variantStyles = {} }) => {
  const styles = getMessageBodyContainerStyles();

  return (
    <Box
      css={variantStyles.messageBodyContainer || styles.bodyContainer}
      className="ec-message-body-container"
    >
      {children}
    </Box>
  );
};

export default MessageBodyContainer;
