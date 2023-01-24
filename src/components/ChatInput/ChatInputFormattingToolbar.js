/* eslint-disable react/prop-types */
import React from 'react';
import Popup from 'reactjs-popup';
import { Box, Icon, ActionButton } from '@rocket.chat/fuselage';
import { EmojiPicker } from '../EmojiPicker/index';
import { useUserStore } from '../../store';
import styles from './ChatInput.module.css';
import { formatter } from '../../lib/textFormat';

const ChatInputFormattingToolbar = ({ messageRef }) => {
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

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
    <Box bg="neutral-500" className={styles.chatFormat}>
      {isUserAuthenticated && (
        <Popup
          disabled={!isUserAuthenticated}
          trigger={
            <Icon
              className={styles.chatInputIconCursor}
              name="emoji"
              size="x20"
              padding={6}
            />
          }
          position="top left"
        >
          <EmojiPicker handleEmojiClick={handleEmojiClick} />
        </Popup>
      )}
      {formatter.map((item, index) => (
        <ActionButton
          bg="neutral-500"
          border="0px"
          onClick={() => {
            wrapSelection(item.pattern);
          }}
          key={index}
        >
          <Icon name={item.name} size="x20" />
        </ActionButton>
      ))}
    </Box>
  );
};

export default ChatInputFormattingToolbar;
