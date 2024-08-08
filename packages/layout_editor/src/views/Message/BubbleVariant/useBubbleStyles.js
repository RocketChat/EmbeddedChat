import { useTheme } from "@embeddedchat/ui-elements";
import { bubbleStyles, bubbleStylesMe } from "./Bubble.styles";

const useBubbleStyles = (isMe = false) => {
  const theme = useTheme();
  const styles = bubbleStyles(theme);
  const meStyles = bubbleStylesMe(theme);

  const mergedStyles = {};

  Object.keys(styles).forEach((key) => {
    mergedStyles[key] = [styles[key], isMe && meStyles[`${key}Me`]].filter(
      Boolean
    );
  });

  return mergedStyles;
};

export default useBubbleStyles;
