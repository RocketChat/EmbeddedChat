import React from 'react';
import { Global, css } from '@emotion/react';
import { useCustomTheme } from '../hooks/useCustomTheme';

const GlobalStyles = () => {
  const { theme, colors } = useCustomTheme();

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

        a {
          color: ${colors.foreground};
        }
      `}
    />
  );
};

export default GlobalStyles;
