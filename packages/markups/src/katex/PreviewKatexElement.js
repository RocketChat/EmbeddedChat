import React from 'react';
import PropTypes from 'prop-types';

import 'katex/dist/katex.css';

const PreviewKatexElement = ({ code }) => <>{code}</>;

export default PreviewKatexElement;
PreviewKatexElement.propTypes = {
  code: PropTypes.string.isRequired,
};
