import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import DefaultTheme from '../theme/DefaultTheme';

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    const defaultMode = 'light';
    const defaultTheme = DefaultTheme;
    const colors = defaultTheme.schemes?.[defaultMode];
    const invertedColors = defaultTheme.schemes?.[invertMode(defaultMode)];

    return {
      theme: defaultTheme,
      mode: defaultMode,
      colors,
      invertedColors,
      setMode: () => {},
      setTheme: () => {},
    };
  }

  return context;
};
