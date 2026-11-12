import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';

const highlightStyle = css`
  background-color: yellow;
  color: black;
`;

const HighlightSpan = ({ contents }) => (
  <mark css={highlightStyle}>{contents}</mark>
);

export default HighlightSpan;

HighlightSpan.propTypes = {
  contents: PropTypes.string,
};
