import React, { useMemo } from "react";
import { Box } from "@embeddedchat/ui-elements";
import { useChatInputFormattingToolbarStyles } from "./ChatInput.styles";
import SurfaceMenu from "../../components/SurfaceMenu/SurfaceMenu";

const ChatInputFormattingToolbar = ({
  optionConfig = {
    surfaceItems: ["emoji", "formatter", "audio", "video", "file"],
    formatters: ["bold", "italic", "strike", "code", "multiline"],
  },
}) => {
  const styles = useChatInputFormattingToolbarStyles();
  const { surfaceItems, formatters } = optionConfig;
  const placeholderSurfaceItem = "placeholder-surface";

  const options = useMemo(() => {
    return {
      emoji: {
        label: "Emoji",
        id: "emoji",
        onClick: () => {},
        iconName: "emoji",
        visible: true,
      },
      audio: {
        label: "Audio Message",
        id: "audio",
        onClick: () => {},
        iconName: "mic",
        visible: true,
      },
      video: {
        label: "Video Message",
        id: "video",
        onClick: () => {},
        iconName: "video-recorder",
        visible: true,
      },
      file: {
        label: "Upload File",
        id: "file",
        onClick: () => {},
        iconName: "attachment",
        visible: true,
      },
      formatter:  {
        label: "Formatter",
        id: "formatter",
        onClick: () => {},
        iconName: "format-text",
        visible: true,
      },
    };
  }, []);

  const surfaceOptions = useMemo(() => {
    return surfaceItems.length > 0
      ? surfaceItems
          .map((item) => {
            if (item === "formatter") {
              return options.formatter;
            }
            if (options[item] && options[item].visible) {
              return {
                id: options[item].id,
                onClick: options[item].onClick,
                label: options[item].label,
                iconName: options[item].iconName,
              };
            }
            return null;
          })
          .filter((option) => option !== null)
      : [{ id: placeholderSurfaceItem, label: "No items", iconName: "plus" }];
  }, [surfaceItems, options]);

  return (
    <Box css={styles.chatFormat} className="ec-chat-input-formatting-toolbar">
      {surfaceOptions.length > 0 && (
        <SurfaceMenu options={surfaceOptions} tooltipPosition="top" />
      )}
    </Box>
  );
};

export default ChatInputFormattingToolbar;
