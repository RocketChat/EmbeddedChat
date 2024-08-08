import React from "react";
import { Box, Icon, useTheme } from "@embeddedchat/ui-elements";
import { getMessageAvatarContainerStyles } from "./Message.styles";

const MessageAvatarContainer = ({ message, sequential }) => {
  const styles = getMessageAvatarContainerStyles(useTheme());

  return (
    <Box css={styles.container}>
      {!sequential ? (
        <Icon
          name="avatar"
          alt="avatar"
          size={message.t ? "1.2em" : "2.25em"}
        />
      ) : null}
    </Box>
  );
};

export default MessageAvatarContainer;
