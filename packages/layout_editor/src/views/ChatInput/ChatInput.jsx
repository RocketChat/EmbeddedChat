import React, { useRef } from "react";
import { css } from "@emotion/react";
import { Box, Input, ActionButton, useTheme } from "@embeddedchat/ui-elements";
import { getChatInputStyles } from "./ChatInput.styles";
import ChatInputToolbar from "./ChatInputToolbar";

const ChatInput = () => {
  const styles = getChatInputStyles(useTheme());

  const inputRef = useRef(null);
  const messageRef = useRef(null);
  const chatInputContainer = useRef(null);

  const handleBlur = () => {
    if (chatInputContainer.current) {
      chatInputContainer.current.classList.remove("focused");
    }
  };

  const handleFocus = () => {
    if (chatInputContainer.current) {
      chatInputContainer.current.classList.add("focused");
    }
  };

  return (
    <Box
      className="ec-chat-input"
      css={styles.inputWithFormattingBox}
      ref={chatInputContainer}
    >
      <Box ref={chatInputContainer}>
        <Box css={styles.inputBox}>
          <Input
            textArea
            rows={1}
            placeholder="Message"
            css={styles.textInput}
            onBlur={handleBlur}
            onFocus={handleFocus}
            ref={messageRef}
          />
          <input type="file" hidden ref={inputRef} />
          <Box
            css={css`
              padding: 0.25rem;
            `}
          >
            <ActionButton
              ghost
              size="large"
              onClick={() => {}}
              type="primary"
              icon="send"
            />
          </Box>
        </Box>
        <ChatInputToolbar messageRef={messageRef} inputRef={inputRef} />
      </Box>
    </Box>
  );
};

export default ChatInput;
