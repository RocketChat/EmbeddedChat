import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, MessageEmoji } from '@rocket.chat/fuselage';
import emojione from 'emoji-toolkit';

const Emoji = ({ big = false, emoji }) => {
  const fallback = useMemo(
    () =>
      'unicode' in emoji
        ? emoji.unicode
        : `:${emoji.shortCode ?? emoji.value.value}:`,
    [emoji]
  );

  return (
    <span
      className={`${!big ? 'joypixels' : 'joypixels_BigEmoji'} emojione`}
      dangerouslySetInnerHTML={{
        __html: big
          ? emojione
              .toImage(fallback)
              .replace('joypixels', 'joypixels_BigEmoji')
          : emojione.toImage(fallback),
      }}
    />
  );
};

export default Emoji;

Emoji.propTypes = {
  emoji: PropTypes.any,
  big: PropTypes.bool,
};
