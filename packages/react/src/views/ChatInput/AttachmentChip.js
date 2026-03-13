import React from 'react';
import { Box, Icon, ActionButton, useTheme } from '@embeddedchat/ui-elements';
import { css } from '@emotion/react';

const AttachmentChip = ({ file, onRemove }) => {
  const { theme } = useTheme();

  const styles = {
    chip: css`
      display: inline-flex;
      align-items: center;
      background: ${theme.colors.background};
      border: 1px solid ${theme.colors.border};
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      margin: 0.25rem;
      max-width: 250px;
      gap: 0.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      border-left: 3px solid ${theme.colors.success};
    `,
    content: css`
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${theme.colors.foreground};
    `,
    fileName: css`
      font-weight: bold;
      color: ${theme.colors.success};
    `,
  };

  return (
    <Box css={styles.chip}>
      <Icon name="attachment" size="1rem" />
      <Box css={styles.content}>
        <span css={styles.fileName}>{file.name}</span>
        {` (${(file.size / 1024).toFixed(1)} KB)`}
      </Box>
      <ActionButton
        ghost
        onClick={() => onRemove(file)}
        size="small"
      >
        <Icon name="cross" size="0.75rem" />
      </ActionButton>
    </Box>
  );
};

export default AttachmentChip;
