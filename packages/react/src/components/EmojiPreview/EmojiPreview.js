import emojione from 'emoji-toolkit';
// import useComponentOverrides from '../../theme/useComponentOverrides';
// import { appendClassNames } from '../../lib/appendClassNames';
import { Box } from '../Box';
import { css } from '@emotion/react';
import styles from './EmojiPreview.module.css';
import emojis from './emojis';
import { useEffect, useState } from 'react';

const EmojiPreview = ({
  messageRef,
  currentEmojiIndex,
  setCurrentEmojiIndex,
  emojiListLengthRef,
}) => {
  const regx = /:([^:]+)/g;
  const [emojisList, setEmojisList] = useState([]);

  emojiListLengthRef.current = emojisList.length;
  console.log(currentEmojiIndex, emojisList.length);
  if (emojiListLengthRef.current === 0) setCurrentEmojiIndex(0);

  const findMatchingEmojis = (unicode) => {
    const matchingEmojis = [];
    for (const emoji in emojis) {
      if (emoji.startsWith(unicode)) {
        matchingEmojis.push({ unicode: emojis[emoji], value: emoji });
        if (matchingEmojis.length === 5) break;
      }
    }
    return matchingEmojis;
  };

  const selectEmoji = (emoji) => {
    const matchingRegex = messageRef.current.value?.match(regx);
    const lastRegex = matchingRegex[matchingRegex.length - 1];
    messageRef.current.value =
      messageRef.current.value.slice(0, -lastRegex.length) + emoji;
    setEmojisList([]);
    emojiListLengthRef.current = 0;
    setCurrentEmojiIndex(0);
  };

  useEffect(() => {
    const regx_data = messageRef.current.value?.match(regx);
    if (regx_data) {
      const unicode = emojione
        .shortnameToUnicode(regx_data[regx_data.length - 1])
        .toLowerCase();
      setEmojisList(findMatchingEmojis(unicode));
    } else {
      setEmojisList([]);
    }
  }, [messageRef.current?.value]);

  useEffect(() => {
    if (currentEmojiIndex >= 3) {
      document
        .getElementById('emoji-list')
        ?.scrollTo(0, 35.3 * (currentEmojiIndex - 2));
    } else {
      document.getElementById('emoji-list')?.scrollTo(0, 0);
    }
  }, [currentEmojiIndex]);

  return (
    <Box>
      {emojisList.length > 0 && (
        <div className={styles.container}>
          <div className={styles.containerHeader}>Emoji</div>
          <div style={{ backgroundColor: 'white' }}>
            <ul className={styles.emojiContainer} id="emoji-list">
              {emojisList.map((emoji, index) => {
                return (
                  <li
                    className={styles.emojiList}
                    style={{
                      backgroundColor:
                        index === currentEmojiIndex
                          ? 'rgba(223, 223, 223, 0.6)'
                          : '',
                    }}
                    onClick={() => selectEmoji(emoji.unicode)}
                  >
                    {emoji.value + ' ' + emoji.unicode}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </Box>
  );
};

export default EmojiPreview;
