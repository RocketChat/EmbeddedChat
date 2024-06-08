import React from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';

export const PopupContent = ({
  className = '',
  style = {},
  children,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('PopupContent');

  return (
    <Box
      className={`ec-popup-content ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    >
      {children}
    </Box>
  );
};
