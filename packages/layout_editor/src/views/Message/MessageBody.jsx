import React from "react";
import { Box } from "@embeddedchat/ui-elements";
import { getMessageBodyStyles } from "./Message.styles";

export const MessageBody = ({
  children,
  variantStyles = {},
  isText = true,
  sequential = false,
  lastSequential = false,
  ...props
}) => {
  const styles = getMessageBodyStyles();
  const messageBodyStyles =
    (isText ? variantStyles.messageBody : variantStyles.attachmentBody) ||
    styles.messageBody;

  return (
    <Box
      css={[
        messageBodyStyles,
        sequential && variantStyles.sequential,
        lastSequential && variantStyles.lastSequential,
      ]}
      className="ec-message-body"
      {...props}
    >
      {children}
    </Box>
  );
};
