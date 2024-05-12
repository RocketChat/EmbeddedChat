import { css } from '@emotion/react';
import * as UiKit from '@rocket.chat/ui-kit';
import React, { memo, useEffect, useState } from 'react';
import useComponentOverrides from '../../../theme/useComponentOverrides';
import { Box } from '../../Box';
import { Skeleton } from '../../Skeleton';
import { useSurfaceType } from '../contexts/SurfaceContext';
import { ImageBlockStyles as styles } from './blocks.styles';

const maxSize = 360;

const fetchImageState = (img) => {
  if (!img.complete) {
    return {
      loading: true,
      width: maxSize,
      height: (maxSize * 9) / 21,
    };
  }

  const { naturalWidth, naturalHeight } = img;

  const scaleRatio =
    naturalWidth > naturalHeight
      ? Math.min(naturalWidth, maxSize) / naturalWidth
      : Math.min(naturalHeight, maxSize) / naturalHeight;

  return {
    loading: false,
    width: naturalWidth * scaleRatio,
    height: naturalHeight * scaleRatio,
  };
};

const ImageBlock = ({ className, block, surfaceRenderer }) => {
  const { classNames, styleOverrides } = useComponentOverrides('ImageBlock');
  const surface = useSurfaceType();

  const alignment =
    surface === 'banner' || surface === 'message' ? 'flex-start' : 'center';

  const [{ loading, width, height }, setState] = useState(() => {
    const img = document.createElement('img');
    img.src = block.imageUrl;
    return fetchImageState(img);
  });

  useEffect(() => {
    const img = document.createElement('img');

    const handleLoad = () => {
      setState(fetchImageState(img));
    };

    img.addEventListener('load', handleLoad);
    img.src = block.imageUrl;

    if (img.complete) {
      img.removeEventListener('load', handleLoad);
      setState(fetchImageState(img));
    }

    return () => {
      img.removeEventListener('load', handleLoad);
    };
  }, [block.imageUrl]);

  return (
    <Box
      css={styles.imageBlock}
      className={`ec-image-block ${className} ${classNames}`}
      style={styleOverrides}
    >
      <Box style={{ overflow: 'hidden', width }}>
        {block.title && (
          <Box css={styles.imageTitle}>
            {surfaceRenderer.renderTextObject(
              block.title,
              0,
              UiKit.BlockContext.NONE
            )}
          </Box>
        )}
        {loading ? (
          <Skeleton variant="rect" width={width} height={height} />
        ) : (
          <Box
            css={styles.image(block.imageUrl, width, height)}
            imageUrl={block.imageUrl}
            width={width}
            height={height}
            aria-label={block.altText}
          />
        )}
      </Box>
    </Box>
  );
};

export default memo(ImageBlock);
