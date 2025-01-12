import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import { InlineElementsStyles } from './elements.styles';
import HighlightText from './highlightText';

const CodeElement = ({ contents }) => {
  const styles = InlineElementsStyles();
  
  if (!Array.isArray(contents)) {
    return null; // or return a fallback UI if `contents` isn't an array
  }

  return (
    <code css={styles.inlineElement}>
      {contents.map((content, index) => {
        switch (content.type) {
          case 'PLAIN_TEXT':
            return <PlainSpan key={index} contents={content.value} />;
        
          case 'HIGHLIGHT_TEXT':
            return <HighlightText key={index} contents={content.value} />;
        
          default:
            return null;
        }
      })}
    </code>
  );
};


export default CodeElement;

CodeElement.propTypes = {
  contents: PropTypes.any,
};
