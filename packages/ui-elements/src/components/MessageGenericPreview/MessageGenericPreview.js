import React from 'react';
import { useMessageGenericPreviewStyles } from './MessageGenericPreview.styles';
import { Box } from '../Box';
import { useComponentOverrides } from '../../hooks';

const MessageGenericPreview = (props, className = '', style = {}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreview'
  );
  const styles = useMessageGenericPreviewStyles();

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
