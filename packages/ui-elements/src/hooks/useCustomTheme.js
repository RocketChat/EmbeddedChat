import { useTheme } from '@emotion/react';
import { useMode } from './useMode';
import DefaultTheme from '../theme/DefaultTheme'; // Adjust the path as per your project structure

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

export const useCustomTheme = () => {
  let theme = useTheme();
  const { mode = 'light' } = useMode();

  if (!theme || !theme.schemes) {
    theme = DefaultTheme;
  }

  const colors = theme.schemes?.[mode];
  const invertedColors = theme.schemes?.[invertMode(mode)];

  return { theme, mode, colors, invertedColors };
};
