import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import HighlightSpan from './HighlightSpan';
import { InlineElementsStyles } from './elements.styles';

const CodeElement = ({ contents }) => {
  const styles = InlineElementsStyles();

  // Handle highlighted content (array of tokens) or plain string
  const renderContents = () => {
    if (contents.hasHighlight && Array.isArray(contents.value)) {
      return contents.value.map((token, index) => {
        switch (token.type) {
          case 'HIGHLIGHT_TEXT':
            return <HighlightSpan key={index} contents={token.value} />;
          case 'PLAIN_TEXT':
          default:
            return <PlainSpan key={index} contents={token.value} />;
        }
      });
    }
    return <PlainSpan contents={contents.value} />;
  };

  return <code css={styles.inlineElement}>{renderContents()}</code>;
};

export default CodeElement;

CodeElement.propTypes = {
  contents: PropTypes.any,
};
