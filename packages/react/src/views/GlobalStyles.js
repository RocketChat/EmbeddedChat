import React from 'react';
import { css, Global } from '@emotion/react';
import { useTheme, alpha } from '@embeddedchat/ui-elements';

const getGlobalStyles = (theme) => css`
  .ec-embedded-chat * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .ec-embedded-chat body {
    font-family: ${theme.typography.default.fontFamily};
    font-size: ${theme.typography.default.fontSize}px;
    font-weight: ${theme.typography.default.fontWeightRegular};
  }

  .ec-embedded-chat a {
    color: ${theme.colors.foreground};
  }

  .ec-embedded-chat ::-webkit-scrollbar {
    width: 4px;
    height: 7.7px;
  }

  .ec-embedded-chat ::-webkit-scrollbar-thumb {
    background: ${alpha(theme.colors.primary, 0.5)};
    border-radius: 4px;
  }

  .ec-embedded-chat ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary};
  }

  .ec-embedded-chat ::-webkit-scrollbar-button {
    display: none;
  }

  @media (max-width: 780px) {
    .ec-sidebar {
      position: absolute;
      width: 100% !important;
      left: 0;
      bottom: 0;
      z-index: 1;
      background: ${theme.colors.background}!important;
    }

    @media (max-height: 430px) {
      .ec-sidebar {
        height: 80vh !important;
      }
    }

    @media (max-height: 712px) and (min-height: 430px) {
      .ec-sidebar {
        height: 86vh !important;
      }
    }

    @media (min-height: 712px) {
      .ec-sidebar {
        height: 89vh !important;
      }
    }
  }
`;

const GlobalStyles = () => {
  const { theme } = useTheme();
  const styles = getGlobalStyles(theme);

  return <Global styles={styles} />;
};

export default GlobalStyles;
