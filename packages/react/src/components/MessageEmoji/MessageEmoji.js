import React from 'react';
import PropTypes from 'prop-types';
import emojione from 'emoji-toolkit';

const MessageEmoji = ({ body }) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: emojione.toImage(body),
      }}
    />
  );
};

MessageEmoji.propTypes = {
  body: PropTypes.string.isRequired,
};

export default MessageEmoji;
