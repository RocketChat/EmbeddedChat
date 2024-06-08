import React from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { usePopupHeaderStyles } from './Popup.styles';

export const PopupHeader = ({ className = '', style = {}, ...props }) => {
  const { classNames, styleOverrides } = useComponentOverrides('PopupHeader');
  const styles = usePopupHeaderStyles();
  return (
    <Box
      css={styles.popupHeader}
      className={`ec-popup-header ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      Hello
    </Box>
  );
};
