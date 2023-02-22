import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';

const CodeElement = ({ contents, classes }) => (
  <code>
    <PlainSpan contents={contents.value}  classes={classes}/>
  </code>
);

export default CodeElement;

CodeElement.propTypes = {
  contents: PropTypes.any,
  classes: PropTypes.object,
};
