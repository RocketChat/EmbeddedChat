import React from 'react';
import { css } from '@emotion/react';
import { Box } from '../../components/Box';
import useComponentOverrides from '../../theme/useComponentOverrides';

const MessageGenericPreviewContent = ({
  className = '',
  style = {},
  thumb,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreviewContent'
  );

  return (
    <Box
      css={css`
        display: flex;
        flex-direction: row;
      `}
      className={`ec-message-generic-preview__content ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
    >
      {thumb}
      <Box className="ec-message-generic-preview__content-wrapper" {...props} />
    </Box>
  );
};

export default MessageGenericPreviewContent;
