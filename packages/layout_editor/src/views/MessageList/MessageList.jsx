import React from "react";
import PropTypes from "prop-types";
import { css } from "@emotion/react";
import { Box, Icon } from "@embeddedchat/ui-elements";

const MessageList = () => (
  <Box
    css={css`
      text-align: center;
      margin: auto;
    `}
  >
    <Icon name="thread" size="2rem" />
    <Box>Ready to chat? Login now to join the fun</Box>
  </Box>
);

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape),
};

export default MessageList;
