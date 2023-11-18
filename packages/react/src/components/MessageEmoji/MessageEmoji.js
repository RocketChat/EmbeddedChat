import React from 'react';
import PropTypes from 'prop-types';
import emojione from 'emoji-toolkit';
import { css } from '@emotion/react';

const MessageEmoji = ({ body }) => {
  const containerStyle = css`
    font-size: 1rem; /* Adjust the size as needed */
  `;

  // const emojiHtml = emojione.toImage(body);

  const emojiRegex = /:\w+:/g;

  const emojiMatches = body.match(emojiRegex);

  let modifiedBody = body;
  if (emojiMatches) {
    emojiMatches.forEach((shortcode) => {
      const emojiHtml = emojione.toImage(shortcode);
      const styledEmojiHtml = emojiHtml.replace('<img', '<img style="height: 1.2em; width: 1.2em;"');
      modifiedBody = modifiedBody.replace(shortcode, styledEmojiHtml);
    });
  }

  return (
    <div css={containerStyle} dangerouslySetInnerHTML={{ __html: modifiedBody }} />
  );
};

MessageEmoji.propTypes = {
  body: PropTypes.string.isRequired,
};

export default MessageEmoji;
