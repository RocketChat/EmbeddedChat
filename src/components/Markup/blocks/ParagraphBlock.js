import PropTypes from 'prop-types';
import React from 'react';
import InlineElements from '../elements/InlineElements';

const ParagraphBlock = ({ contents, classes }) => (
  <p style={{ display: 'flex' }}>
    <InlineElements contents={contents} classes={classes} />
  </p>
);

export default ParagraphBlock;

ParagraphBlock.propTypes = {
  contents: PropTypes.any,
  classes: PropTypes.object,
};
