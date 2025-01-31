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
import InsertLinkToolBox from './InsertLinkToolBox';

const ChatInputFormattingToolbar = ({
  messageRef,
  inputRef,
  triggerButton,
  optionConfig = {
    surfaceItems: ['emoji', 'formatter', 'link', 'audio', 'video', 'file'],
    formatters: ['bold', 'italic', 'strike', 'code', 'multiline'],
    smallScreenSurfaceItems: ['emoji', 'video', 'audio', 'file'],
    popOverItems: ['formatter', 'link'],
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
  const [isInsertLinkOpen, setInsertLinkOpen] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

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

  const handleAddLink = (linkText, linkUrl) => {
    if (!linkText || !linkUrl) {
      setInsertLinkOpen(false);
      return;
    }

    const start = messageRef.current.selectionStart;
    const end = messageRef.current.selectionEnd;
    const msg = messageRef.current.value;
    const hyperlink = `[${linkText}](${linkUrl})`;
    const message = msg.slice(0, start) + hyperlink + msg.slice(end);

    triggerButton?.(null, message);
    setInsertLinkOpen(false);
  };

  const isTyping = messageRef.current?.value.length > 0;
  const chatToolMap = {
    emoji:
      isPopoverOpen && popOverItems.includes('emoji') ? (
        <Box
          key="emoji"
          css={styles.popOverItemStyles}
          disabled={isRecordingMessage}
          onClick={() => {
            if (isRecordingMessage) return;
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
              if (isRecordingMessage) return;
              setEmojiOpen(true);
            }}
          >
            <Icon name="emoji" size="1.25rem" />
          </ActionButton>
        </Tooltip>
      ),

    audio: (
      <AudioMessageRecorder
        displayName={
          isPopoverOpen && popOverItems.includes('audio') ? 'audio' : null
        }
        disabled={isRecordingMessage || isTyping}
        popOverItemStyles={styles.popOverItemStyles}
      />
    ),
    video: (
      <VideoMessageRecorder
        displayName={
          isPopoverOpen && popOverItems.includes('video') ? 'video' : null
        }
        popOverItemStyles={styles.popOverItemStyles}
        disabled={isRecordingMessage || isTyping}
      />
    ),
    file:
      isPopoverOpen && popOverItems.includes('file') ? (
        <Box
          key="file"
          css={styles.popOverItemStyles}
          disabled={isRecordingMessage || isTyping}
          onClick={() => {
            if (isRecordingMessage || isTyping) return;
            handleClickToOpenFiles();
          }}
        >
          <Icon name="attachment" size="1rem" />
          <span>file</span>
        </Box>
      ) : (
        <Tooltip text="Upload File" position="top" key="file">
          <ActionButton
            square
            ghost
            disabled={isRecordingMessage || isTyping}
            onClick={() => {
              if (isRecordingMessage) return;
              handleClickToOpenFiles();
            }}
          >
            <Icon name="attachment" size="1.25rem" />
          </ActionButton>
        </Tooltip>
      ),
    link:
      isPopoverOpen && popOverItems.includes('link') ? (
        <Box
          key="link"
          css={styles.popOverItemStyles}
          disabled={isRecordingMessage}
          onClick={() => {
            if (isRecordingMessage) return;
            setInsertLinkOpen(true);
          }}
        >
          <Icon name="link" size="1rem" />
          <span>link</span>
        </Box>
      ) : (
        <Tooltip text="Link" position="top" key="link">
          <ActionButton
            square
            ghost
            disabled={isRecordingMessage}
            onClick={() => {
              if (isRecordingMessage) return;
              setInsertLinkOpen(true);
            }}
          >
            <Icon name="link" size="1.25rem" />
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
                if (isRecordingMessage) return;
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
                if (isRecordingMessage) return;
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
          @media (max-width: 499px) {
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
          @media (min-width: 500px) {
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
        {popOverItems.length > 0 && (
          <Tooltip text="More" position="top" key="more-btn">
            <ActionButton
              square
              ghost
              disabled={isRecordingMessage}
              onClick={() => {
                if (isRecordingMessage) return;
                setPopoverOpen(!isPopoverOpen);
              }}
            >
              <Icon name="kebab" size="1.25rem" />
            </ActionButton>
          </Tooltip>
        )}
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

      {isInsertLinkOpen && (
        <InsertLinkToolBox
          selectedText={window.getSelection().toString()}
          handleAddLink={handleAddLink}
          onClose={() => setInsertLinkOpen(false)}
        />
      )}
    </Box>
  );
};

export default ChatInputFormattingToolbar;
