import React, { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs, monokai } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { CodeBlockStyles } from './elements.styles';

const CodeBlock = ({ lines }) => {
  const { mode } = useTheme();
  const styles = CodeBlockStyles();
  const code = useMemo(
    () => lines.map((line) => line.value.value).join('\n'),
    [lines]
  );

  return (
    <pre role="region" css={styles.prestyle}>
      <Box is="span" css={styles.copyonly}>
        ```
      </Box>
      <SyntaxHighlighter
        style={mode === 'dark' ? monokai : vs}
        wrapLines
        css={styles.codeBlock}
      >
        {code}
      </SyntaxHighlighter>
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
