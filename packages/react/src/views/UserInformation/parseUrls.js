import React from 'react';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';

const URL_REGEX = /(https?:\/\/[^\s<>"']+)/gi;

export const parseUrls = (text, theme, mode) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const parts = [];
  let lastIndex = 0;
  let match;
  
  URL_REGEX.lastIndex = 0;

  while ((match = URL_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const url = match[0];
    
    parts.push(
      <a
        key={`url-${match.index}-${lastIndex}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: 'underline',
          color:
            mode === 'light'
              ? theme.colors.info
              : theme.colors.warningForeground,
        }}
      >
        {url}
      </a>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  if (parts.length === 0) {
    return text;
  }

  return (
    <Box
      css={css`
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.4;
      `}
    >
      {parts}
    </Box>
  );
};