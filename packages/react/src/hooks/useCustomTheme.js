import { useTheme } from '@emotion/react';
import { useThemeStore } from '../store';

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

export const useCustomTheme = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];
  const invertedColors = theme.schemes[invertMode(mode)];

  return { theme, mode, colors, invertedColors };
};
