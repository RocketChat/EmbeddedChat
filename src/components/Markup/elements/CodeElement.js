import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';

const CodeElement = ({ contents }) => (
  <code>
    <PlainSpan contents={contents.value} />
  </code>
);

export default CodeElement;

CodeElement.propTypes = {
  contents: PropTypes.any,
};
