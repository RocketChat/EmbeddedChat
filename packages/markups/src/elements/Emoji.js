import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import emojione from 'emoji-toolkit';
import { Box } from '@embeddedchat/ui-elements';
import DOMPurify from 'dompurify';
import { EmojiStyles as styles } from './elements.styles';

const Emoji = ({ big = false, emoji }) => {
  const fallback = useMemo(
    () =>
      'unicode' in emoji
        ? emoji.unicode
        : `:${emoji.shortCode ?? emoji.value.value}:`,
    [emoji]
  );

  const emojiHtml = big
    ? emojione.toImage(fallback).replace('joypixels', 'joypixels_BigEmoji')
    : emojione.toImage(fallback);

  return (
    <Box
      is="span"
      css={[styles.emojione, styles.emojiInMessage]}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(emojiHtml) }}
    />
  );
};

export default Emoji;

Emoji.propTypes = {
  emoji: PropTypes.any,
  big: PropTypes.bool,
};
