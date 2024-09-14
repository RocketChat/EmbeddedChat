import { useTheme } from '@embeddedchat/ui-elements';
import { getBubbleStyles, getBubbleStylesMe } from './Bubble.styles';

const useBubbleStyles = (isMe = false) => {
  const { theme } = useTheme();
  const styles = getBubbleStyles(theme);
  const meStyles = getBubbleStylesMe(theme);

  const mergedStyles = {};

  Object.keys(styles).forEach((key) => {
    mergedStyles[key] = [styles[key], isMe && meStyles[`${key}Me`]].filter(
      Boolean
    );
  });

  return mergedStyles;
};

export default useBubbleStyles;
