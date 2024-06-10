import { bubbleStyles, bubbleStylesMe } from './Bubble.styles';
import { useCustomTheme } from '../../../hooks/useCustomTheme';

const useBubbleStyles = (isMe = false) => {
  const customTheme = useCustomTheme();
  const styles = bubbleStyles(customTheme);
  const meStyles = bubbleStylesMe(customTheme);

  const mergedStyles = {};

  Object.keys(styles).forEach((key) => {
    mergedStyles[key] = [styles[key], isMe && meStyles[`${key}Me`]].filter(
      Boolean
    );
  });

  return mergedStyles;
};

export default useBubbleStyles;
