import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@embeddedchat/ui-elements';
import { CodeBlockStyles as styles } from './elements.styles';

const CodeBlock = ({ lines }) => {
  const code = useMemo(
    () => lines.map((line) => line.value.value).join('\n'),
    [lines]
  );

  return (
    <pre role="region" css={styles.prestyle}>
      <Box is="span" css={styles.copyonly}>
        ```
      </Box>
      <code>{code}</code>
      <Box is="span" css={styles.copyonly}>
        ```
      </Box>
    </pre>
  );
};

export default CodeBlock;

CodeBlock.propTypes = {
  lines: PropTypes.any,
};
