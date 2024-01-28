/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import { css } from '@emotion/react';
import { EmojiPicker } from '../EmojiPicker/index';
import { useMessageStore, useUserStore } from '../../store';
import styles from './ChatInput.module.css';
import { formatter } from '../../lib/textFormat';
import AudioMessageRecorder from './AudioMessageRecorder';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { Tooltip } from '../Tooltip';
import useComponentOverrides from '../../theme/useComponentOverrides';

const ChatInputFormattingToolbar = ({ messageRef, inputRef }) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'ChatInputFormattingToolbar'
  );
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const isRecordingMessage = useMessageStore(
    (state) => state.isRecordingMessage
  );

  const [isEmojiOpen, setEmojiOpen] = useState(false);
  const handleClickToOpenFiles = () => {
    inputRef.current.click();
  };

  const handleEmojiClick = (emojiEvent) => {
    const [emoji] = emojiEvent.names;
    messageRef.current.value += ` :${emoji.replace(/\s/g, '_')}: `;
  };

  const wrapSelection = (pattern) => {
    const input = messageRef.current;
    const { selectionEnd = input.value.length, selectionStart = 0 } = input;
    const initText = input.value.slice(0, selectionStart);
    const selectedText = input.value.slice(selectionStart, selectionEnd);
    const finalText = input.value.slice(selectionEnd, input.value.length);

    const startPattern = pattern.slice(0, pattern.indexOf('{{text}}'));
    const endPattern = pattern.slice(
      pattern.indexOf('{{text}}') + '{{text}}'.length
    );

    const startPatternFound = initText.endsWith(startPattern);
    const endPatternFound = finalText.startsWith(endPattern);

    if (startPatternFound && endPatternFound) {
      // Text is already wrapped, so unwrap it
      input.value =
        initText.slice(0, initText.length - startPattern.length) +
        selectedText +
        finalText.slice(endPattern.length);

      input.selectionStart = selectionStart - startPattern.length;
      input.selectionEnd = input.selectionStart + selectedText.length;
    } else {
      // Text is not wrapped, so wrap it
      const wrappedText = startPattern + selectedText + endPattern;
      if (!document.execCommand?.('insertText', false, wrappedText)) {
        input.value = initText + wrappedText + finalText;
      }

      input.selectionStart = selectionStart + startPattern.length;
      input.selectionEnd = input.selectionStart + selectedText.length;
    }
  };

  return (
    <Box
      css={css`
        background-color: #cbced1;
        display: flex;
        flex-direction: row;
        gap: 0.375rem;
        align-items: center;
      `}
      className={`ec-chat-input-formatting-toolbar ${styles.chatFormat} ${classNames}`}
      style={styleOverrides}
    >
      {isUserAuthenticated && (
        <>
          <Tooltip text="Emoji" position="top">
            <div>
              <ActionButton
                square
                ghost
                disabled={isRecordingMessage}
                onClick={() => setEmojiOpen((t) => !t)}
              >
                <Icon name="emoji" size="1.25rem" />
              </ActionButton>
            </div>
          </Tooltip>
          <Popup
            modal
            open={isEmojiOpen}
            onClose={() => setEmojiOpen(false)}
            closeOnEscape
            disabled={isRecordingMessage}
            closeOnDocumentClick
            position="left center"
          >
            <EmojiPicker
              handleEmojiClick={(emoji) => {
                setEmojiOpen(false);
                handleEmojiClick(emoji);
              }}
            />
          </Popup>
        </>
      )}
      {formatter.map((item, index) => (
        <Tooltip text={item.name} position="top" key={index}>
          <ActionButton
            square
            disabled={isRecordingMessage}
            ghost
            onClick={() => {
              wrapSelection(item.pattern);
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
      <Tooltip text="Audio Message" position="top">
        <AudioMessageRecorder />
      </Tooltip>
      <ActionButton
        square
        ghost
        disabled={isRecordingMessage}
        onClick={handleClickToOpenFiles}
      >
        <Icon name="plus" size="1.25rem" style={{ padding: '0.5em' }} />
      </ActionButton>
    </Box>
  );
};

export default ChatInputFormattingToolbar;
