import React, { useMemo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import hljs from 'highlight.js';
import { CodeBlockStyles } from './elements.styles';

const CodeBlock = ({ lines }) => {
  const { mode } = useTheme();
  const styles = CodeBlockStyles();
  const [highlightedCode, setHighlightedCode] = useState('');
  const code = useMemo(
    () => lines.map((line) => line.value.value).join('\n'),
    [lines]
  );

  useEffect(() => {
    const loadTheme = async () => {
      const existingStylesheet = document.getElementById('highlightjs-styles');
      if (existingStylesheet) {
        existingStylesheet.remove();
      }
      const theme = mode === 'dark' ? 'monokai' : 'vs';
      const newStylesheet = document.createElement('link');
      newStylesheet.rel = 'stylesheet';
      newStylesheet.id = 'highlightjs-styles';
      newStylesheet.href = `https://cdn.jsdelivr.net/npm/highlight.js/styles/${theme}.css`;
      document.head.appendChild(newStylesheet);
    };
    loadTheme();
  }, [mode]);

  useEffect(() => {
    if (code) {
      const result = hljs.highlightAuto(code);
      setHighlightedCode(result.value);
    }
  }, [code, mode]);

  return (
    <pre role="region" css={styles.prestyle}>
      <Box is="span" css={styles.copyonly}>
        ```
      </Box>
      <Box css={styles.codeStyles}>
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </Box>
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
