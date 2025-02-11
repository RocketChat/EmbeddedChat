import React from 'react';
import 'katex/dist/katex.css';
import PropTypes from 'prop-types';

const PreviewKatexBlock = ({ code }) => <>{code}</>;

export default PreviewKatexBlock;
PreviewKatexBlock.propTypes = {
  code: PropTypes.string.isRequired,
};
