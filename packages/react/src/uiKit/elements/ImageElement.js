import React from 'react';
import * as UiKit from '@rocket.chat/ui-kit';
import { Box } from '../../components/Box';
import { ImageElementStyles as styles } from './elements.styles';

const ImageElement = ({ block, context }) => {
  const size =
    (context === UiKit.BlockContext.SECTION && 88) ||
    (context === UiKit.BlockContext.CONTEXT && 20) ||
    undefined;

  if (!size) {
    return null;
  }

  return <Box css={styles.container(block.imageUrl, size)} size={size} />;
};

export default ImageElement;
