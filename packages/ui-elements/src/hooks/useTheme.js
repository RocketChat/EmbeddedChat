import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContextProvider';
import DefaultTheme from '../theme/DefaultTheme';

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    const defaultMode = 'light';
    const theme = DefaultTheme;
    const colors = theme.schemes?.[defaultMode];
    const invertedColors = theme.schemes?.[invertMode(defaultMode)];

    const modifiedTheme = {
      ...theme,
      colors,
      invertedColors,
    };

    return {
      theme: modifiedTheme,
      mode: defaultMode,
      setMode: () => {},
      setTheme: () => {},
    };
  }

  return context;
};

export default useTheme;
