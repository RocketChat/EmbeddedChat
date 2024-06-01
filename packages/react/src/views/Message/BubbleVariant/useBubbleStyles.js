import bubbleStyles from './Bubble.styles';
import { useCustomTheme } from '../../../hooks/useCustomTheme';

const useBubbleStyles = (
  isMe = false,
  sequential = false,
  lastSequential = false
) => {
  const customTheme = useCustomTheme();
  const bubbleStyle = bubbleStyles(customTheme);

  const mergeStyle = (styleName) => {
    const baseStyle = bubbleStyle[styleName];
    const meStyle = bubbleStyle[`${styleName}Me`];
    return isMe ? [baseStyle, meStyle].filter(Boolean) : baseStyle;
  };

  const getBubbleStyles = (name) =>
    [
      mergeStyle(name),
      sequential && mergeStyle('sequential'),
      lastSequential && mergeStyle('lastSequential'),
    ].filter(Boolean);

  return { getBubbleStyles };
};

export default useBubbleStyles;
