import { useTheme } from '@embeddedchat/ui-elements';

const simpleHash = (str) => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  return hash;
};

const useDisplayNameColor = () => {
  const { theme, mode } = useTheme();

  const getDisplayNameColor = (username) => {
    const hash = simpleHash(username);
    const { saturation, luminance } = theme.contrastParams[mode];
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, ${saturation}%, ${luminance}%)`;
  };

  return getDisplayNameColor;
};

export default useDisplayNameColor;
