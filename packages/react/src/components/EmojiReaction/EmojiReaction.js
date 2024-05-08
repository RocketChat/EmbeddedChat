import React from 'react';
import PropTypes from 'prop-types';
import emojione from 'emoji-toolkit';
import { css } from '@emotion/react';

const EmojiReaction = ({ body }) => {
  const containerStyle = css`
    font-size: 1rem;
  `;

  const emojiHtml = emojione.toImage(body);

  return (
    <div css={containerStyle} dangerouslySetInnerHTML={{ __html: emojiHtml }} />
  );
};

EmojiReaction.propTypes = {
  body: PropTypes.string.isRequired,
};

export default EmojiReaction;
