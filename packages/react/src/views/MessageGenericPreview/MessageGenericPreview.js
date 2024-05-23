import React from 'react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../../components/Box';
import useMessageGenericPreviewStyles from './MessageGenericPreview.styles';

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
