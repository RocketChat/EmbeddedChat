import React from 'react';
import { getMessageGenericPreviewStyles } from './MessageGenericPreview.styles';
import { Box } from '../Box';
import { useComponentOverrides, useTheme } from '../../hooks';

const MessageGenericPreview = (props, className = '', style = {}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreview'
  );
  const { theme } = useTheme();
  const styles = getMessageGenericPreviewStyles(theme);

  return (
    <Box
      css={styles.container}
      className={`ec-message-generic-preview ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    />
  );
};

export default MessageGenericPreview;
