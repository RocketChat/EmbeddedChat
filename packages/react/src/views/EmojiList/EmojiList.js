import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import getEmojiListStyles from './EmojiList.styles';

function EmojiList({
  emojiIndex,
  messageRef,
  filteredEmojis,
  setFilteredEmojis,
  setEmojiIndex,
  setStartReadEmoji,
  setShowEmojiList,
}) {
  const itemRefs = useRef([]);
  const { theme } = useTheme();
  const styles = getEmojiListStyles(theme);

  const handleEmojiClick = useCallback(
    (selectedEmoji) => {
      const currentMessage = messageRef.current.value;
      const emojiMatch = currentMessage.match(/:(.*?)$/);

      if (emojiMatch) {
        // Replace the :query with the selected emoji
        const beforeQuery = currentMessage.substring(
          0,
          currentMessage.lastIndexOf(':')
        );
        const insertionText = `${beforeQuery}${selectedEmoji.emoji} `;

        messageRef.current.value = insertionText;

        // Set cursor position after the emoji and space
        const cursorPosition = insertionText.length;
        messageRef.current.setSelectionRange(cursorPosition, cursorPosition);
        messageRef.current.focus();

        // Clear emoji autocomplete state
        setFilteredEmojis([]);
        setEmojiIndex(-1);
        setStartReadEmoji(false);
        setShowEmojiList(false);
      }
    },
    [
      messageRef,
      setFilteredEmojis,
      setEmojiIndex,
      setShowEmojiList,
      setStartReadEmoji,
    ]
  );

  const setItemRef = (el, index) => {
    itemRefs.current[index] = el;
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'Enter': {
          const selectedEmoji = filteredEmojis[emojiIndex];
          if (selectedEmoji) {
            handleEmojiClick(selectedEmoji);
          }
          break;
        }
        case 'Escape': {
          // Cancel emoji selection
          setFilteredEmojis([]);
          setEmojiIndex(-1);
          setStartReadEmoji(false);
          setShowEmojiList(false);
          messageRef.current.focus();
          break;
        }
        case 'ArrowUp':
          event.preventDefault();
          setEmojiIndex(
            emojiIndex - 1 < 0 ? filteredEmojis.length - 1 : emojiIndex - 1
          );
          break;
        case 'ArrowDown':
          event.preventDefault();
          setEmojiIndex(
            emojiIndex + 1 >= filteredEmojis.length ? 0 : emojiIndex + 1
          );
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [
    emojiIndex,
    filteredEmojis,
    handleEmojiClick,
    setEmojiIndex,
    setFilteredEmojis,
    setStartReadEmoji,
    setShowEmojiList,
    messageRef,
  ]);

  useEffect(() => {
    if (itemRefs.current[emojiIndex]) {
      itemRefs.current[emojiIndex].scrollIntoView({
        block: 'nearest',
      });
    }
  }, [emojiIndex]);

  if (!filteredEmojis || filteredEmojis.length === 0) {
    return null;
  }

  return (
    <Box css={styles.main}>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {filteredEmojis.map((emoji, index) => (
          <li
            key={`${emoji.shortname}-${index}`}
            role="presentation"
            css={styles.listItem}
            onClick={() => handleEmojiClick(emoji)}
            ref={(el) => setItemRef(el, index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleEmojiClick(emoji);
              }
            }}
            style={{
              backgroundColor: index === emojiIndex && 'rgba(0, 0, 0, 0.1)',
              color: index === emojiIndex && theme.colors.foreground,
            }}
          >
            <Box css={styles.emoji}>{emoji.emoji}</Box>
            <Box css={styles.shortname}>:{emoji.shortname}:</Box>
          </li>
        ))}
      </ul>
    </Box>
  );
}

EmojiList.propTypes = {
  emojiIndex: PropTypes.number,
  messageRef: PropTypes.object.isRequired,
  filteredEmojis: PropTypes.array,
  setFilteredEmojis: PropTypes.func.isRequired,
  setEmojiIndex: PropTypes.func.isRequired,
  setStartReadEmoji: PropTypes.func.isRequired,
  setShowEmojiList: PropTypes.func.isRequired,
};

export default EmojiList;
