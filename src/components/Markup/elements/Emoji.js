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
    <MessageEmoji big={big}>
      <Box dangerouslySetInnerHTML={{ __html: emojione.toImage(fallback) }} />
    </MessageEmoji>
  );
};

export default Emoji;

Emoji.propTypes = {
  emoji: PropTypes.any,
  big: PropTypes.bool,
};
