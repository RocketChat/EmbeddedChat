import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { MessageGenericPreviewStyles as styles } from './MessageGenericPreview.styles';

const MessageGenericPreview = (props, className = '', style = {}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MessageGenericPreview'
  );

  return (
    <div
      css={styles.container}
      className={`ec-message-generic-preview ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    />
  );
};

export default MessageGenericPreview;
