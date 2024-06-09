/* eslint-disable no-bitwise */
import { useCustomTheme } from './useCustomTheme';

const simpleHash = (str) => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return hash;
};

const useUsernameColor = () => {
  const { theme, mode } = useCustomTheme();

  const getRandomColor = (username) => {
    const hash = simpleHash(username);
    const { saturation, luminance } = theme.schemes.contrastParams[mode];
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, ${saturation}%, ${luminance}%)`;
  };

  return getRandomColor;
};

export default useUsernameColor;
