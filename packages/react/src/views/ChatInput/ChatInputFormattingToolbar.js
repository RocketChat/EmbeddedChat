import React, { useState } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  Icon,
  ActionButton,
  Tooltip,
  useComponentOverrides,
  useTheme,
} from '@embeddedchat/ui-elements';
import { EmojiPicker } from '../EmojiPicker/index';
import { useMessageStore } from '../../store';
import { formatter } from '../../lib/textFormat';
import AudioMessageRecorder from './AudioMessageRecorder';
import VideoMessageRecorder from './VideoMessageRecoder';
import { getChatInputFormattingToolbarStyles } from './ChatInput.styles';
import formatSelection from '../../lib/formatSelection';

const ChatInputFormattingToolbar = ({
  messageRef,
  inputRef,
  optionConfig = {
    surfaceItems: ['emoji', 'formatter', 'audio', 'video', 'file'],
    formatters: ['bold', 'italic', 'strike', 'code', 'multiline'],
  },
}) => {
  const { classNames, styleOverrides, configOverrides } = useComponentOverrides(
    'ChatInputFormattingToolbar'
  );
  const theme = useTheme();
  const styles = getChatInputFormattingToolbarStyles(theme);
  const surfaceItems =
    configOverrides.optionConfig?.surfaceItems || optionConfig.surfaceItems;
  const formatters =
    configOverrides.optionConfig?.formatters || optionConfig.formatters;

  const isRecordingMessage = useMessageStore(
    (state) => state.isRecordingMessage
  );

  const [isEmojiOpen, setEmojiOpen] = useState(false);

  const handleClickToOpenFiles = () => {
    inputRef.current.click();
  };

  const handleEmojiClick = (emojiEvent) => {
    const [emoji] = emojiEvent.names;
    messageRef.current.value += ` :${emoji.replace(/[\s-]+/g, '_')}: `;
  };

  const chatToolMap = {
    emoji: (
      <Tooltip text="Emoji" position="top" key="emoji-btn">
        <ActionButton
          square
          ghost
          disabled={isRecordingMessage}
          onClick={() => {
            setEmojiOpen(true);
          }}
        >
          <Icon name="emoji" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),
    audio: (
      <Tooltip text="Audio Message" position="top" key="audio">
        <AudioMessageRecorder />
      </Tooltip>
    ),
    video: (
      <Tooltip text="Video Message" position="top" key="video">
        <VideoMessageRecorder />
      </Tooltip>
    ),
    file: (
      <Tooltip text="Upload File" position="top" key="file">
        <ActionButton
          square
          ghost
          disabled={isRecordingMessage}
          onClick={handleClickToOpenFiles}
        >
          <Icon name="attachment" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),
    formatter: formatters
      .map((name) => formatter.find((item) => item.name === name))
      .map((item) => (
        <Tooltip text={item.name} position="top" key={`formatter-${item.name}`}>
          <ActionButton
            square
            disabled={isRecordingMessage}
            ghost
            onClick={() => {
              formatSelection(messageRef, item.pattern);
            }}
          >
            <Icon
              disabled={isRecordingMessage}
              name={item.name}
              size="1.25rem"
            />
          </ActionButton>
        </Tooltip>
      )),
  };

  return (
    <Box
      css={styles.chatFormat}
      className={`ec-chat-input-formatting-toolbar ${classNames}`}
      style={styleOverrides}
    >
      {surfaceItems.map((key) => chatToolMap[key])}

      {isEmojiOpen && (
        <EmojiPicker
          key="emoji-picker"
          handleEmojiClick={(emoji) => {
            setEmojiOpen(false);
            handleEmojiClick(emoji);
          }}
          onClose={() => setEmojiOpen(false)}
          positionStyles={css`
            position: absolute;
            bottom: 7rem;
            left: 1.85rem;
          `}
        />
      )}
    </Box>
  );
};

export default ChatInputFormattingToolbar;
