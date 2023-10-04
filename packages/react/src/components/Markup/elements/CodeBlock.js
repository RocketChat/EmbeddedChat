import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react'; // Step 1: Import `css` from Emotion.sh

const styles = {
  copyonly: css`
    display: none;
    width: 100%;
    height: 0;
    user-select: none;
    vertical-align: baseline;
    font-size: 0;
    -moz-box-orient: vertical;
  `,
  prestyle: css`
    display: inline-block;
    width: 100%;
  `,
};

const CodeBlock = ({ lines }) => {
  const code = useMemo(
    () => lines.map((line) => line.value.value).join('\n'),
    [lines]
  );

  return (
    <pre role="region" css={styles.prestyle}>
      <span css={styles.copyonly}>```</span>
      <code>{code}</code>
      <span css={styles.copyonly}>```</span>
    </pre>
  );
};

export default CodeBlock;

CodeBlock.propTypes = {
  lines: PropTypes.any,
};
