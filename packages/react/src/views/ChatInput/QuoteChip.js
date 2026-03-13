import React, { useContext } from 'react';
import { Box, Icon, ActionButton, useTheme } from '@embeddedchat/ui-elements';
import { css } from '@emotion/react';
import RCContext from '../../context/RCInstance';

const QuoteChip = ({ message, onRemove }) => {
  const { theme } = useTheme();
  const { RCInstance } = useContext(RCContext);
  const instanceHost = RCInstance.getHost();

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
      border-left: 3px solid ${theme.colors.primary};
    `,
    content: css`
      font-size: 0.8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: ${theme.colors.foreground};
    `,
    author: css`
      font-weight: bold;
      margin-right: 0.25rem;
      color: ${theme.colors.primary};
    `,
  };

  return (
    <Box css={styles.chip}>
      <Box css={styles.content}>
        <span css={styles.author}>{message.u.username}:</span>
        {message.msg || (message.file ? 'File attachment' : '...')}
      </Box>
      <ActionButton
        ghost
        onClick={() => onRemove(message)}
        size="small"
      >
        <Icon name="cross" size="0.75rem" />
      </ActionButton>
    </Box>
  );
};

export default QuoteChip;
