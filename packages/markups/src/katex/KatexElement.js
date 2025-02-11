import katex from 'katex';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import 'katex/dist/katex.css';

const KatexElement = ({ code }) => {
  const html = useMemo(
    () =>
      katex.renderToString(code, {
        displayMode: false,
        macros: {
          '\\href': '\\@secondoftwo',
        },
        maxSize: 100,
      }),
    [code]
  );

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export default KatexElement;
KatexElement.prototype = {
  code: PropTypes.string.isRequired,
};
