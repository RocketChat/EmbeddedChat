import React from 'react';
import { css } from '@emotion/react';
import { Box, Sidebar, useTheme } from '@embeddedchat/ui-elements';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

const isMac =
  typeof navigator !== 'undefined' &&
  /Mac/.test(navigator.userAgentData?.platform || navigator.platform);
const mod = isMac ? '⌘' : 'Ctrl';
const alt = isMac ? '⌥' : 'Alt';

const shortcuts = [
  {
    action: 'Open Channel / User search',
    keys: `${mod} + K`,
  },
  {
    action: 'Edit previous message',
    keys: '↑ (Up Arrow)',
  },
  {
    action: 'Bold message',
    keys: `${mod} + B`,
  },
  {
    action: 'Italic message',
    keys: `${mod} + I`,
  },
  {
    action: 'Move to the beginning of the message',
    keys: `${mod} / ${alt} + ←`,
  },
  {
    action: 'Move to the beginning of the message',
    keys: `${mod} / ${alt} + ↑`,
  },
  {
    action: 'Move to the end of the message',
    keys: `${mod} / ${alt} + →`,
  },
  {
    action: 'Move to the end of the message',
    keys: `${mod} / ${alt} + ↓`,
  },
  {
    action: 'New line in message compose input',
    keys: 'Shift + Enter',
  },
];

const getStyles = (theme) => ({
  list: css`
    display: flex;
    flex-direction: column;
    padding: 0.75rem;
    gap: 0.25rem;
  `,
  row: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.5rem;
    border-bottom: 1px solid ${theme.colors.border};
    gap: 0.75rem;
  `,
  action: css`
    font-size: 0.875rem;
    color: ${theme.colors.foreground};
    flex: 1;
  `,
  keys: css`
    font-size: 0.8125rem;
    font-family: monospace;
    color: ${theme.colors.secondaryForeground};
    background: ${theme.colors.background};
    border: 1px solid ${theme.colors.border};
    border-radius: 4px;
    padding: 0.2rem 0.5rem;
    white-space: nowrap;
  `,
});

const KeyboardShortcuts = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const setExclusiveState = useSetExclusiveState();

  return (
    <Sidebar
      title="Keyboard Shortcuts"
      iconName="key"
      onClose={() => setExclusiveState(null)}
    >
      <Box css={styles.list}>
        {shortcuts.map((shortcut) => (
          <Box key={`${shortcut.action}-${shortcut.keys}`} css={styles.row}>
            <span css={styles.action}>{shortcut.action}</span>
            <span css={styles.keys}>{shortcut.keys}</span>
          </Box>
        ))}
      </Box>
    </Sidebar>
  );
};

export default KeyboardShortcuts;
