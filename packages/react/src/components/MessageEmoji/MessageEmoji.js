import React from 'react';
import PropTypes from 'prop-types';
import emojione from 'emoji-toolkit';
import { css } from '@emotion/react';

const MessageEmoji = ({ body }) => {
  const containerStyle = css`
    font-size: 1rem; /* You can adjust the size as needed */
  `;

  const emojiHtml = emojione.toImage(body);

  return (
    <div css={containerStyle} dangerouslySetInnerHTML={{ __html: emojiHtml }} />
  );
};

MessageEmoji.propTypes = {
  body: PropTypes.string.isRequired,
};

export default MessageEmoji;
