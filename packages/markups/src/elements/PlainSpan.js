import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { MarkupInteractionContext } from '../MarkupInteractionContext';
import highlightSegments from './highlightSegments';
import { HighlightStyles } from './elements.styles';

const PlainSpan = ({ contents }) => {
  const { highlight } = useContext(MarkupInteractionContext) || {};
  const styles = HighlightStyles();

  if (!highlight) {
    return <>{contents}</>;
  }

  const segments = highlightSegments(contents, highlight);
  if (segments.length === 1 && !segments[0].match) {
    return <>{contents}</>;
  }

  return (
    <>
      {segments.map((segment, index) =>
        segment.match ? (
          <mark key={index} css={styles.highlight}>
            {segment.text}
          </mark>
        ) : (
          <React.Fragment key={index}>{segment.text}</React.Fragment>
        )
      )}
    </>
  );
};

export default PlainSpan;

PlainSpan.propTypes = {
  contents: PropTypes.string,
};
