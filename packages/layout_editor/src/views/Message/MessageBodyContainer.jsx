import React from "react";
import { Box } from "@embeddedchat/ui-elements";

import { useMessageBodyContainerStyles } from "./Message.styles";

const MessageBodyContainer = ({ children, variantStyles = {} }) => {
  const styles = useMessageBodyContainerStyles();

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
