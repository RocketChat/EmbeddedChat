import React from 'react';
import PropTypes from 'prop-types';
import ParagraphBlock from './ParagraphBlock';

const QuoteBlock = ({ contents, classes }) => (
  <blockquote>
    {contents.map((paragraph, index) => (
      <ParagraphBlock key={index} contents={paragraph.value} classes={classes} />
    ))}
  </blockquote>
);

export default QuoteBlock;

QuoteBlock.propTypes = {
  contents: PropTypes.arrayOf(PropTypes.shape),
  classes: PropTypes.object,
};
