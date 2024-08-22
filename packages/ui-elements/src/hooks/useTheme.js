import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContextProvider';
import DefaultTheme from '../theme/DefaultTheme';

const invertMode = (mode) => (mode === 'light' ? 'dark' : 'light');

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    const defaultMode = 'light';
    const { schemes, ...restParams } = DefaultTheme;
    const colors = schemes?.[defaultMode];
    const invertedColors = schemes?.[invertMode(defaultMode)];

    const theme = {
      ...restParams,
      colors,
      invertedColors,
    };

    return {
      theme: theme,
      mode: defaultMode,
      setMode: () => {},
      setTheme: () => {},
    };
  }

  return context;
};

export default useTheme;
