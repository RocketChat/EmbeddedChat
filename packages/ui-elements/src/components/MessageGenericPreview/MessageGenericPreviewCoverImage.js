import React from 'react';
import { css } from '@emotion/react';
import { Box } from '../Box';
import { useComponentOverrides } from '../../hooks';

const MessageGenericPreviewCoverImage = ({
  className = '',
  style = {},
  url,
  width,
  height,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreviewCoverImage'
  );

  return (
    <Box
      css={css`
        background-image: url(${url});
        max-width: 100%;
      `}
      className={`ec-message-generic-preview__preview ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      <Box style={{ paddingTop: `${(height / width) * 100}%` }} />
    </Box>
  );
};

export default MessageGenericPreviewCoverImage;
