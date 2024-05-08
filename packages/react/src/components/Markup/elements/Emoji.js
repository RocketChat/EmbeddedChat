import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import emojione from 'emoji-toolkit';

const emojiInMessageCss = css`
  img.joypixels {
    height: 1.5rem;
    width: 1.5rem;
    image-rendering: pixelated;
    font-size: inherit;
    vertical-align: middle;
  }

  img.joypixels_BigEmoji {
    height: 2.75rem;
    width: 2.75rem;
    image-rendering: pixelated;
    font-size: inherit;
  }
`;

const emojioneCss = css`
  margin: 0 0.15em;
  vertical-align: middle;
  white-space: nowrap;
  font-size: inherit;
  line-height: normal;
`;

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

  console.log('Rendered emoji HTML:', emojiHtml);

  return (
    <span
      css={[emojioneCss, emojiInMessageCss]}
      dangerouslySetInnerHTML={{ __html: emojiHtml }}
    />
  );
};

export default Emoji;

Emoji.propTypes = {
  emoji: PropTypes.any,
  big: PropTypes.bool,
};
