import PropTypes from 'prop-types';
import React from 'react';
import InlineElements from '../elements/InlineElements';

const ParagraphBlock = ({ contents, members }) => (
  <p>
    <InlineElements contents={contents} members = {members}/>
  </p>
);

export default ParagraphBlock;

ParagraphBlock.propTypes = {
  contents: PropTypes.any,
};
