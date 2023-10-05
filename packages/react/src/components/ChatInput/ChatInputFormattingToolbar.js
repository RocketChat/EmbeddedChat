/* eslint-disable react/prop-types */
import React from 'react';
import Popup from 'reactjs-popup';
import he from 'he';
import { css, styles } from '@emotion/react';
import { EmojiPicker } from '../EmojiPicker/index';
import { useMessageStore, useUserStore } from '../../store';
import { formatter } from '../../lib/textFormat';
import AudioMessageRecorder from './AudioMessageRecorder';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
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

  const handleClickToOpenFiles = () => {
    inputRef.current.click();
  };

  const handleEmojiClick = (n) => {
    if (n.length > 5) {
      const flagUnifed = `&#x${n.split('-').join(';&#x')};`;
      const flag = he.decode(flagUnifed);
      messageRef.current.value += flag;
      return;
    }
    const unified_emoji = he.decode(`&#x${n};`);
    messageRef.current.value += unified_emoji;
  };

  const wrapSelection = (pattern) => {
    const input = messageRef.current;
    const { selectionEnd = input.value.length, selectionStart = 0 } = input;
    const initText = input.value.slice(0, selectionStart);
    const selectedText = input.value.slice(selectionStart, selectionEnd);
    const finalText = input.value.slice(selectionEnd, input.value.length);

    if (
      !document.execCommand ||
      !document.execCommand(
        'insertText',
        false,
        pattern.replace('{{text}}', selectedText)
      )
    ) {
      input.value =
        initText + pattern.replace('{{text}}', selectedText) + finalText;
    }

    input.selectionStart = selectionStart + pattern.indexOf('{{text}}');
    input.selectionEnd = input.selectionStart + selectedText.length;
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
        <Popup
          disabled={isRecordingMessage}
          trigger={
            <ActionButton square ghost disabled={isRecordingMessage}>
              <Icon name="emoji" size="1.25rem" />
            </ActionButton>
          }
          position="top left"
        >
          <EmojiPicker handleEmojiClick={handleEmojiClick} />
        </Popup>
      )}
      {formatter.map((item, index) => (
        <ActionButton
          square
          disabled={isRecordingMessage}
          ghost
          onClick={() => {
            wrapSelection(item.pattern);
          }}
          key={index}
        >
          <Icon disabled={isRecordingMessage} name={item.name} size="1.25rem" />
        </ActionButton>
      ))}
      <AudioMessageRecorder />
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
