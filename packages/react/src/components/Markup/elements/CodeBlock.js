import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';

// Define Emotion styling for .copyonly class
const copyOnlyStyles = css`
  display: none;
  width: 100%;
  height: 0;
  user-select: none;
  vertical-align: baseline;
  font-size: 0;
  -moz-box-orient: vertical;
`;

// Define Emotion styling for .prestyle class
const prestyleStyles = css`
  display: inline-block;
  width: 100%;
`;

const CodeBlock = ({ lines }) => {
  const code = useMemo(
    () => lines.map((line) => line.value.value).join('\n'),
    [lines]
  );

  return (
    <pre role="region" css={prestyleStyles}>
      <span css={copyOnlyStyles}>```</span>
      <code>{code}</code>
      <span css={copyOnlyStyles}>```</span>
    </pre>
  );
};

export default CodeBlock;

CodeBlock.propTypes = {
  lines: PropTypes.any,
};
