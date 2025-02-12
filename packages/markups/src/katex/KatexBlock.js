import PropTypes from 'prop-types';
import katex from 'katex';
import React, { useMemo } from 'react';

import 'katex/dist/katex.css';

const KatexBlock = ({ code }) => {
  const html = useMemo(
    () =>
      katex.renderToString(code, {
        displayMode: true,
        macros: {
          '\\href': '\\@secondoftwo',
        },
        maxSize: 100,
      }),
    [code]
  );

  return (
    <div
      role="math"
      style={{ overflowX: 'auto' }}
      aria-label={code}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default KatexBlock;
KatexBlock.prototype = {
  code: PropTypes.string.isRequired,
};
