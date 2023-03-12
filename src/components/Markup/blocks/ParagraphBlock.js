import PropTypes from 'prop-types';
import React from 'react';
import InlineElements from '../elements/InlineElements';

const ParagraphBlock = ({ contents, classes }) => (
  <p>
    <InlineElements contents={contents} classes={classes} />
  </p>
);

export default ParagraphBlock;

ParagraphBlock.propTypes = {
  contents: PropTypes.any,
  classes: PropTypes.object,
};
