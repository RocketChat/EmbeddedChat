import React from 'react';
import { css, Global } from '@emotion/react';
import { useTheme, alpha } from '@embeddedchat/ui-elements';

const useStyles = ({ colors, theme }) => css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${theme.typography.global.fontFamily};
    font-size: ${theme.typography.global.fontSize}px;
    font-weight: ${theme.typography.global.fontWeightRegular};
  }

  a {
    color: ${colors.foreground};
  }

  ::-webkit-scrollbar {
    width: 4px;
    height: 7.7px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${alpha(colors.primary, 0.5)};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.primary};
  }

  ::-webkit-scrollbar-button {
    display: none;
  }
`;

const GlobalStyles = () => {
  const styles = useStyles(useTheme());

  return <Global styles={styles} />;
};

export default GlobalStyles;
