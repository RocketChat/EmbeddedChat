import { useTheme } from '@emotion/react';

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

export const useCustomTheme = () => {
  const theme = useTheme();

  const mode = 'light';

  const colors = theme.schemes?.[mode];
  const invertedColors = theme.schemes?.[invertMode(mode)];

  return { theme, mode, colors, invertedColors };
};
