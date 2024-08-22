import React, { createContext, useMemo, useState, useEffect } from 'react';
import DefaultTheme from '../theme/DefaultTheme';

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

export const ThemeContext = createContext();

export const ThemeProvider = ({
  children,
  theme: initialTheme,
  mode: initialMode,
}) => {
  const defaultTheme = initialTheme || DefaultTheme;
  const [mode, setMode] = useState(initialMode || 'light');
  const [theme, setTheme] = useState(defaultTheme);
  const colors = theme.schemes?.[mode];
  const invertedColors = theme.schemes?.[invertMode(mode)];

  const modifiedTheme = useMemo(
    () => ({
      ...theme,
      colors,
      invertedColors,
    }),
    [theme, colors, invertedColors]
  );

  useEffect(() => {
    if (initialTheme) {
      setTheme(initialTheme);
    }
  }, [initialTheme]);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  const value = useMemo(
    () => ({
      theme: modifiedTheme,
      mode,
      setMode,
      setTheme,
    }),
    [modifiedTheme, mode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
