import React from 'react';
import PropTypes from 'prop-types';
import emojione from 'emoji-toolkit';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';
import DOMPurify from 'dompurify';

const EmojiReaction = ({ body }) => {
  const emojiHtml = emojione.toImage(body);

  return (
    <Box
      css={css`
        font-size: 1rem;
      `}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(emojiHtml) }}
    />
  );
};

EmojiReaction.propTypes = {
  body: PropTypes.string.isRequired,
};

export default EmojiReaction;
