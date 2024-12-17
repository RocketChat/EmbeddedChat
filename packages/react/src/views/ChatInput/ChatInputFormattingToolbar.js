import React, { useState, useRef, useEffect } from 'react';
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
  triggerButton,
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
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickToOpenFiles = () => {
    inputRef.current.click();
  };

  const handleEmojiClick = (emojiEvent) => {
    const [emoji] = emojiEvent.names;
    const message = `${messageRef.current.value} :${emoji.replace(
      /[\s-]+/g,
      '_'
    )}: `;
    triggerButton?.(null, message);
  };

  const handleFormatterClick = (item) => {
    formatSelection(messageRef, item.pattern);
    setPopoverOpen(false);
  };

  const chatToolMap = {
    audio: (
      <Tooltip text="Audio Message" position="top" key="audio">
        <AudioMessageRecorder />
      </Tooltip>
    ),
    video: (
      <ActionButton
        square
        ghost
        disabled={isRecordingMessage}
        onClick={() => {}}
      >
        <VideoMessageRecorder />
      </ActionButton>
    ),
    file: (
      <ActionButton
        square
        ghost
        disabled={isRecordingMessage}
        onClick={handleClickToOpenFiles}
      >
        <Icon name="attachment" size="1.25rem" />
      </ActionButton>
    ),
  };

  return (
    <Box
      css={styles.chatFormat}
      className={`ec-chat-input-formatting-toolbar ${classNames}`}
      style={styleOverrides}
    >
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

      <Box
        css={css`
          display: flex;
          @media (max-width: 400px) {
            display: none;
          }
        `}
      >
        {formatters
          .map((name) => formatter.find((item) => item.name === name))
          .map((item) => (
            <Tooltip
              text={item.name}
              position="top"
              key={`formatter-${item.name}`}
            >
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
          ))}

        {['audio', 'file', 'video'].map((key) => chatToolMap[key])}
      </Box>

      <Box
        css={css`
          @media (min-width: 400px) {
            display: none;
          }
        `}
      >
        <Tooltip text="More" position="top" key="more-btn">
          <ActionButton
            square
            ghost
            disabled={isRecordingMessage}
            onClick={() => setPopoverOpen(true)}
          >
            <Icon name="kebab" size="1.25rem" />
          </ActionButton>
        </Tooltip>
      </Box>

      {isPopoverOpen && (
        <Box ref={popoverRef} css={styles.popOverStyles}>
          {formatters
            .map((name) => formatter.find((item) => item.name === name))
            .map((item) => (
              <ActionButton
                key={item.name}
                square
                disabled={isRecordingMessage}
                ghost
                onClick={() => handleFormatterClick(item)}
                css={css`
                  padding: 8px;
                  cursor: pointer;
                `}
              >
                <Icon
                  disabled={isRecordingMessage}
                  name={item.name}
                  size="1.25rem"
                />
              </ActionButton>
            ))}
          {['video', 'file'].map((key) => (
            <Box
              key={key}
              css={css`
                padding: 8px;
              `}
            >
              {chatToolMap[key]}
            </Box>
          ))}
        </Box>
      )}

      {surfaceItems.includes('audio') && chatToolMap.audio}

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
            left: 0.7rem;
          `}
        />
      )}
    </Box>
  );
};

export default ChatInputFormattingToolbar;
