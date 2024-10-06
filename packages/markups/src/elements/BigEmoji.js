import React from 'react';
import PropTypes from 'prop-types';
import Emoji from './Emoji';

const BigEmoji = ({ contents }) => (
  <>
    {contents.map((content, index) => (
      <Emoji big key={index} emoji={content} />
    ))}
  </>
);

export default BigEmoji;

BigEmoji.propTypes = {
  contents: PropTypes.any,
};
