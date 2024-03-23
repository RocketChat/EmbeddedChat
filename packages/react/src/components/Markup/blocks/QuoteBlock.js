import React from 'react';
import PropTypes from 'prop-types';
import ParagraphBlock from './ParagraphBlock';

const QuoteBlock = ({ contents }) => (
  <blockquote>
    {contents.map((paragraph, index) => (
      <ParagraphBlock key={index} contents={paragraph.value} />
    ))}
  </blockquote>
);

export default QuoteBlock;

QuoteBlock.propTypes = {
  contents: PropTypes.arrayOf(PropTypes.shape),
};
