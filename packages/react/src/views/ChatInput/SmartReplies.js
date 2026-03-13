import React from 'react';
import { Box, Button, useTheme, lighten, darken } from '@embeddedchat/ui-elements';
import { css } from '@emotion/react';
import { useAiStore } from '../../store';

const SmartReplies = ({ onReplyClick }) => {
  const { smartReplies, aiLoading } = useAiStore();
  const { theme, mode } = useTheme();

  if (aiLoading) {
    return null; // Or a small loader
  }

  if (!smartReplies || smartReplies.length === 0) {
    return null;
  }

  const styles = {
    container: css`
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
      padding: 0 4px;
    `,
    replyBtn: css`
      font-size: 0.8rem;
      padding: 4px 12px;
      border-radius: 16px;
      cursor: pointer;
      border: 1px solid
        ${mode === 'light'
          ? darken(theme.colors.background, 0.1)
          : lighten(theme.colors.background, 0.1)};
      background-color: ${theme.colors.background};
      color: ${theme.colors.foreground};
      &:hover {
        background-color: ${mode === 'light'
          ? darken(theme.colors.background, 0.05)
          : lighten(theme.colors.background, 0.05)};
      }
    `,
  };

  return (
    <Box css={styles.container}>
      {smartReplies.map((reply, index) => (
        <Box
          key={index}
          is="button"
          css={styles.replyBtn}
          onClick={() => onReplyClick(reply)}
        >
          {reply}
        </Box>
      ))}
    </Box>
  );
};

export default SmartReplies;
