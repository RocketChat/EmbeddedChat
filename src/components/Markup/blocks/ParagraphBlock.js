import PropTypes from 'prop-types';
import React from 'react';
import InlineElements from '../elements/InlineElements';

const ParagraphBlock = ({ contents }) => (
  <p>
    <InlineElements contents={contents} />
  </p>
);

export default ParagraphBlock;

ParagraphBlock.propTypes = {
  contents: PropTypes.any,
};
