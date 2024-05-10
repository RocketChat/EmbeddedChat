import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { CodeBlockStyles as styles } from './elements.styles';

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
