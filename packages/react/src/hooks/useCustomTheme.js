import { useTheme } from '@emotion/react';
import { useRCContext } from '../context/RCInstance';

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

export const useCustomTheme = () => {
  const { ECOptions } = useRCContext();
  const theme = useTheme();
  const mode = ECOptions?.mode;
  const colors = theme.schemes[mode];
  const invertedColors = theme.schemes[invertMode(mode)];

  return { theme, mode, colors, invertedColors };
};
