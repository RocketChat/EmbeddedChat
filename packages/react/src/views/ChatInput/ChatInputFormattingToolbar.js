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
import InsertLinkToolBox from './InsertLinkToolBox';

const ChatInputFormattingToolbar = ({
  messageRef,
  inputRef,
  triggerButton,
  optionConfig = {
    surfaceItems: ['emoji', 'formatter', 'link', 'audio', 'video', 'file'],
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
  const [isInsertLinkOpen, setInsertLinkOpen] = useState(false);

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

  const chatToolMap = {
    emoji: (
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
      <Tooltip text="Audio Message" position="top" key="audio">
        <AudioMessageRecorder disabled={isRecordingMessage} />
      </Tooltip>
    ),
    video: (
      <Tooltip text="Video Message" position="top" key="video">
        <VideoMessageRecorder disabled={isRecordingMessage} />
      </Tooltip>
    ),
    file: (
      <Tooltip text="Upload File" position="top" key="file">
        <ActionButton
          square
          ghost
          disabled={isRecordingMessage}
          onClick={() => {
            if (isRecordingMessage) return;
            handleClickToOpenFiles();
          }}
        >
          <Icon name="attachment" size="1.25rem" />
        </ActionButton>
      </Tooltip>
    ),
    link: (
      <Tooltip text="Link" position="top" key="link">
        <ActionButton
          square
          ghost
          disabled={isRecordingMessage}
          onClick={() => {
            setInsertLinkOpen(true);
          }}
        >
          <Icon name="link" size="1.25rem" />
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
