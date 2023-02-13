import PropTypes from 'prop-types';
import React from 'react';
import PreviewInlineElements from './PreviewInlineElements';

const Paragraph = ({ contents }) => (
  <p>
    <PreviewInlineElements key={0} contents={contents} />
  </p>
);

Paragraph.propTypes = {
  contents: PropTypes.object,
};

export default Paragraph;
