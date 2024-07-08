import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import BoldSpan from './BoldSpan';
import ItalicSpan from './ItalicSpan';

const StrikeSpan = ({ contents }) => (
  <del>
    {contents.map((content, index) => {
      switch (content.type) {
        case 'PLAIN_TEXT':
          return <PlainSpan key={index} contents={content.value} />;

        case 'ITALIC':
          return <ItalicSpan key={index} contents={content.value} />;

        case 'BOLD':
          return <BoldSpan key={index} contents={content.value} />;

        default:
          return null;
      }
    })}
  </del>
);

export default StrikeSpan;

StrikeSpan.propTypes = {
  contents: PropTypes.any,
};
