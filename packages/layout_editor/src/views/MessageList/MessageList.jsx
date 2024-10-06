import React from "react";
import PropTypes from "prop-types";
import { css } from "@emotion/react";
import { isSameDay } from "date-fns";
import { Box, Icon } from "@embeddedchat/ui-elements";
import Message from "../Message/Message";
import isMessageLastSequential from "../../lib/isMessageLastSequential";
import isMessageSequential from "../../lib/isMessageSequential";
import messages from "../../data/messages.json";

const MessageList = () => {
  const isMessageNewDay = (current, previous) =>
    !previous || !isSameDay(new Date(current.ts), new Date(previous.ts));

  return (
    <>
      {messages.length === 0 ? (
        <Box
          css={css`
            text-align: center;
            margin: auto;
          `}
        >
          <Icon name="thread" size="2rem" />
          <Box>No messages</Box>
        </Box>
      ) : (
        <>
          {messages.map((msg, index, arr) => {
            const prev = arr[index + 1];
            const next = arr[index - 1];

            if (!msg) return null;
            const newDay = isMessageNewDay(msg, prev);
            const sequential = isMessageSequential(msg, prev, 300);
            const lastSequential =
              sequential && isMessageLastSequential(msg, next);

            return (
              <Message
                key={msg._id}
                message={msg}
                newDay={newDay}
                sequential={sequential}
                lastSequential={lastSequential}
                showAvatar
              />
            );
          })}
        </>
      )}
    </>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape),
};

export default MessageList;
