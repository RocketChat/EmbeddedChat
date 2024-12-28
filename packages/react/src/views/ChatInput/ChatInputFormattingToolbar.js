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
    smallScreenSurfaceItems: [
      'emoji',
      'popoverItems',
      'audio',
      'video',
      'file',
    ],
    popOverItems: ['formatter'],
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
  const smallScreenSurfaceItems =
    configOverrides.optionConfig?.smallScreenSurfaceItems ||
    optionConfig.smallScreenSurfaceItems;
  const popOverItems =
    configOverrides.optionConfig?.popOverItems || optionConfig.popOverItems;
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
  const handleFormatterClick = (item) => {
    formatSelection(messageRef, item.pattern);
    setPopoverOpen(false);
  };
  const handleEmojiClick = (emojiEvent) => {
    const [emoji] = emojiEvent.names;
    const message = `${messageRef.current.value} :${emoji.replace(
      /[\s-]+/g,
      '_'
    )}: `;
    triggerButton?.(null, message);
  };

  const chatToolMap = {
    emoji:
      isPopoverOpen && popOverItems.includes('emoji') ? (
        <Box
          key="emoji"
          css={styles.popOverItemStyles}
          disabled={isRecordingMessage}
          onClick={() => {
            setEmojiOpen(true);
          }}
        >
          <Icon name="emoji" size="1rem" />
          <span>emoji</span>
        </Box>
      ) : (
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
        <AudioMessageRecorder
          displayName={
            isPopoverOpen && popOverItems.includes('audio') ? 'audio' : null
          }
          popOverItemStyles={styles.popOverItemStyles}
        />
      </Tooltip>
    ),
    video: (
      <Tooltip text="Video Message" position="top" key="video">
        <VideoMessageRecorder
          displayName={
            isPopoverOpen && popOverItems.includes('video') ? 'video' : null
          }
          popOverItemStyles={styles.popOverItemStyles}
        />
      </Tooltip>
    ),
    file:
      isPopoverOpen && popOverItems.includes('file') ? (
        <Box
          key="file"
          css={styles.popOverItemStyles}
          disabled={isRecordingMessage}
          onClick={handleClickToOpenFiles}
        >
          <Icon name="attachment" size="1rem" />
          <span>file</span>
        </Box>
      ) : (
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
      .map((item) =>
        isPopoverOpen && popOverItems.includes('formatter') ? (
          <>
            <Box
              key={item.name}
              disabled={isRecordingMessage}
              onClick={() => {
                handleFormatterClick(item);
              }}
              css={styles.popOverItemStyles}
            >
              <Icon
                disabled={isRecordingMessage}
                name={item.name}
                size="1rem"
              />
              <span>{item.name}</span>
            </Box>
          </>
        ) : (
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
        )
      ),
    popoverItems: (
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
    ),
  };

  return (
    <Box
      css={styles.chatFormat}
      className={`ec-chat-input-formatting-toolbar ${classNames}`}
      style={styleOverrides}
    >
      <Box
        css={css`
          display: flex;
          @media (max-width: 399px) {
            display: none;
          }
        `}
      >
        {surfaceItems.map((key) => chatToolMap[key])}
      </Box>
      {isPopoverOpen && (
        <Box ref={popoverRef} css={styles.popOverStyles}>
          {popOverItems.map((name) => {
            const itemInFormatter = formatter.find(
              (item) => item.name === name
            );
            if (itemInFormatter) {
              return (
                <Box
                  key={itemInFormatter.name}
                  disabled={isRecordingMessage}
                  onClick={() => handleFormatterClick(itemInFormatter)}
                  css={styles.popOverItemStyles}
                >
                  <Icon
                    disabled={isRecordingMessage}
                    name={itemInFormatter.name}
                    size="1rem"
                  />
                  <span>{itemInFormatter.name}</span>
                </Box>
              );
            }
            return chatToolMap[name];
          })}
        </Box>
      )}

      <Box
        css={css`
          @media (min-width: 400px) {
            display: none;
          }
        `}
      >
        {smallScreenSurfaceItems.map((name) => {
          const itemInFormatter = formatter.find((item) => item.name === name);
          if (itemInFormatter) {
            return (
              <Tooltip
                text={itemInFormatter.name}
                position="top"
                key={`formatter-${itemInFormatter.name}`}
              >
                <ActionButton
                  square
                  disabled={isRecordingMessage}
                  ghost
                  onClick={() =>
                    formatSelection(messageRef, itemInFormatter.pattern)
                  }
                >
                  <Icon
                    disabled={isRecordingMessage}
                    name={itemInFormatter.name}
                    size="1.25rem"
                  />
                </ActionButton>
              </Tooltip>
            );
          }
          return chatToolMap[name];
        })}
      </Box>
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
