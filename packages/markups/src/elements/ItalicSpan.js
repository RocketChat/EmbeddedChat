import React from 'react';
import PropTypes from 'prop-types';
import PlainSpan from './PlainSpan';
import BoldSpan from './BoldSpan';
import StrikeSpan from './StrikeSpan';

const ItalicSpan = ({ contents }) => (
  <em>
    {contents.map((content, index) => {
      switch (content.type) {
        case 'PLAIN_TEXT':
          return <PlainSpan key={index} contents={content.value} />;

        case 'STRIKE':
          return <StrikeSpan key={index} contents={content.value} />;

        case 'BOLD':
          return <BoldSpan key={index} contents={content.value} />;

        default:
          return null;
      }
    })}
  </em>
);

export default ItalicSpan;

ItalicSpan.propTypes = {
  contents: PropTypes.any,
};
