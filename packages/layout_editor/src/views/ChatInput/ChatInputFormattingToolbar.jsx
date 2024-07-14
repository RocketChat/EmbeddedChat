import React from "react";
import { Box, Icon, ActionButton, Tooltip } from "@embeddedchat/ui-elements";
import { formatter } from "../../lib/textFormat";
import { useChatInputFormattingToolbarStyles } from "./ChatInput.styles";

const ChatInputFormattingToolbar = ({
  optionConfig = {
    surfaceItems: ["emoji", "formatter", "audio", "video", "file"],
  },
}) => {
  const styles = useChatInputFormattingToolbarStyles();
  const surfaceItems = optionConfig.surfaceItems;

  const chatToolMap = {
    emoji: (
      <Box key="emoji">
        <Tooltip text="Emoji" position="top" key="emoji-btn">
          <ActionButton square ghost>
            <Icon name="emoji" size="1.25rem" />
          </ActionButton>
        </Tooltip>
      </Box>
    ),
    audio: (
      <Tooltip text="Audio Message" position="top" key="audio">
        <ActionButton ghost square>
          <Icon size="1.25rem" name="mic" />
        </ActionButton>
      </Tooltip>
    ),
    video: (
      <Tooltip text="Video Message" position="top" key="video">
        <ActionButton ghost square>
          <Icon size="1.25rem" name="video-recorder" />
        </ActionButton>
      </Tooltip>
    ),
    file: (
      <Tooltip text="Upload File" position="top" key="file">
        <ActionButton square ghost>
          <Icon name="attachment" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),
    formatter: formatter.map((item) => (
      <Tooltip text={item.name} position="top" key={`formatter-${item.name}`}>
        <ActionButton square ghost>
          <Icon name={item.name} size="1.25rem" />
        </ActionButton>
      </Tooltip>
    )),
  };

  return (
    <Box css={styles.chatFormat} className="ec-chat-input-formatting-toolbar">
      {surfaceItems.map((key) => chatToolMap[key])}
    </Box>
  );
};

export default ChatInputFormattingToolbar;
