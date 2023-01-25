import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './CodeBlock.module.css';

const CodeBlock = ({ lines }) => {
  const code = useMemo(
    () => lines.map((line) => line.value.value).join('\n'),
    [lines]
  );

  return (
    <pre role="region" className={styles.prestyle}>
      <span className={styles.copyonly}>```</span>
      <code>{code}</code>
      <span className={styles.copyonly}>```</span>
    </pre>
  );
};

export default CodeBlock;

CodeBlock.propTypes = {
  lines: PropTypes.any,
};
