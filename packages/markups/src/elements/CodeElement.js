import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import { InlineElementsStyles } from './elements.styles';

const CodeElement = ({ contents }) => {
  const styles = InlineElementsStyles();
  return (
    <code css={styles.inlineElement}>
      <PlainSpan contents={contents.value} />
    </code>
  );
};

export default CodeElement;

CodeElement.propTypes = {
  contents: PropTypes.any,
};
