import React from 'react';
import PropTypes from 'prop-types';
import Emoji from './Emoji';

const BigEmoji = ({ value }) => (
  <>
    {value.map((content, index) => (
      <Emoji isBigEmoji key={index} block={content} />
    ))}
  </>
);

export default BigEmoji;

BigEmoji.propTypes = {
  value: PropTypes.any,
};
