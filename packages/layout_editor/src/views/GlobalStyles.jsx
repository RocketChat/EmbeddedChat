import React from 'react';
import { css, Global } from '@emotion/react';
import { useTheme, alpha } from '@embeddedchat/ui-elements';

const getGlobalStyles = ({ theme }) => css`
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
    color: ${theme.colors.foreground};
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${alpha(theme.colors.primary, 0.5)};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary};
  }

  ::-webkit-scrollbar-button {
    display: none;
  }
`;

const GlobalStyles = () => {
  const styles = getGlobalStyles(useTheme());

  return <Global styles={styles} />;
};

export default GlobalStyles;
