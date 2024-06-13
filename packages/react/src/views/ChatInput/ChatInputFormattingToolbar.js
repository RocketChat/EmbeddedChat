import React, { useState } from 'react';
import { css } from '@emotion/react';
import { EmojiPicker } from '../EmojiPicker/index';
import { useMessageStore } from '../../store';
import { formatter } from '../../lib/textFormat';
import AudioMessageRecorder from './AudioMessageRecorder';
import { Box } from '../../components/Box';
import { Icon } from '../../components/Icon';
import { ActionButton } from '../../components/ActionButton';
import { Tooltip } from '../../components/Tooltip';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import VideoMessageRecorder from './VideoMessageRecoder';
import { useChatInputFormattingToolbarStyles } from './ChatInput.styles';
import formatSelection from '../../lib/formatSelection';

const ChatInputFormattingToolbar = ({
  messageRef,
  inputRef,
  toolConfig = ['emoji', 'formatter', 'audio', 'video', 'file'],
}) => {
  const { classNames, styleOverrides, configOverrides } = useComponentOverrides(
    'ChatInputFormattingToolbar'
  );

  const styles = useChatInputFormattingToolbarStyles();
  const toolOptions = configOverrides.optionConfig?.toolOptions || toolConfig;

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
      <Box key="emoji">
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

        {isEmojiOpen && (
          <EmojiPicker
            key="emoji-picker"
            handleEmojiClick={(emoji) => {
              setEmojiOpen(false);
              handleEmojiClick(emoji);
            }}
            positionStyles={css`
              position: absolute;
              bottom: 7rem;
              left: 1.85rem;
            `}
            onClose={() => setEmojiOpen(false)}
          />
        )}
      </Box>
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
    formatter: formatter.map((item) => (
      <Tooltip text={item.name} position="top" key={`formatter-${item.name}`}>
        <ActionButton
          square
          disabled={isRecordingMessage}
          ghost
          onClick={() => {
            formatSelection(messageRef, item.pattern);
          }}
        >
          <Icon disabled={isRecordingMessage} name={item.name} size="1.25rem" />
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
      {toolOptions.map((key) => chatToolMap[key])}
    </Box>
  );
};

export default ChatInputFormattingToolbar;
