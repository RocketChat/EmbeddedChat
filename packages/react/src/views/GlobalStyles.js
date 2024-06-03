import React from 'react';
import { Global, css, useTheme } from '@emotion/react';

const GlobalStyles = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: ${theme.typography.default.fontFamily};
          font-size: ${theme.typography.default.fontSize}px;
          font-weight: ${theme.typography.default.fontWeightRegular};
        }
      `}
    />
  );
};

export default GlobalStyles;
