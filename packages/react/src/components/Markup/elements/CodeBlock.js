import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';

const copyonly = css`
  display: none;
  width: 100%;
  height: 0;
  user-select: none;
  vertical-align: baseline;
  font-size: 0;
  -moz-box-orient: vertical;
`;

const prestyle = css`
  display: inline-block;
  max-width: 100%;
  overflow-x: auto;
  white-space: pre-wrap;
`;

const CodeBlock = ({ lines }) => {
  const code = useMemo(
    () => lines.map((line) => line.value.value).join('\n'),
    [lines]
  );

  return (
    <pre role="region" css={prestyle}>
      <span css={copyonly}>```</span>
      <code>{code}</code>
      <span css={copyonly}>```</span>
    </pre>
  );
};

export default CodeBlock;

CodeBlock.propTypes = {
  lines: PropTypes.any,
};
