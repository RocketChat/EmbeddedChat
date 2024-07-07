import React, { createContext, useMemo, useState } from 'react';
import DefaultTheme from '../theme/DefaultTheme';

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

export const ThemeContext = createContext();

export const ThemeProvider = ({
  children,
  theme: initialTheme,
  initialMode,
}) => {
  const defaultTheme = initialTheme || DefaultTheme;
  const [mode, setMode] = useState(initialMode || 'light');
  const [theme, setTheme] = useState(defaultTheme);

  const colors = theme.schemes?.[mode];
  const invertedColors = theme.schemes?.[invertMode(mode)];

  const value = useMemo(
    () => ({
      theme,
      mode,
      colors,
      invertedColors,
      setMode,
      setTheme,
    }),
    [theme, mode, colors, invertedColors]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
