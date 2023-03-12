import PropTypes from 'prop-types';
import React from 'react';
import InlineElements from '../elements/InlineElements';

const ParagraphBlock = ({ contents }) => (
  <p style={{ display: 'flex' }}>
    <InlineElements contents={contents} />
  </p>
);

export default ParagraphBlock;

ParagraphBlock.propTypes = {
  contents: PropTypes.any,
};
