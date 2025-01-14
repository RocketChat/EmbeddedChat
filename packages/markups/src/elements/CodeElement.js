import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import HighlightText from './highlightText';
import { InlineElementsStyles } from './elements.styles';

const CodeElement = ({ contents }) => {
  const styles = InlineElementsStyles();

  const contentsArray = Array.isArray(contents) ? contents : [contents];
  return (
    <code css={styles.inlineElement}>
      {contentsArray.map((content, index) => {
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
  contents: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
      })
    ),
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    }),
  ]).isRequired,
};
