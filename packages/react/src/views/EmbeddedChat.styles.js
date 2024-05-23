import { css } from '@emotion/react';
import { useCustomTheme } from '../hooks/useCustomTheme';
import { alpha } from '../lib/color';

export const styles = {
  embeddedchat: (theme, dark) => css`
    background: ${theme.schemes[dark ? 'dark' : 'light'].background};
    color: ${theme.schemes[dark ? 'dark' : 'light'].foreground};
    display: flex;
    flex-direction: column;
    border: ${`1.5px solid  ${theme.schemes[dark ? 'dark' : 'light'].border}`};
    border-radius: ${theme.schemes.radius};
  `,
  fullscreen: css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100vh !important;
    max-width: unset !important;
    max-height: unset !important;
    border-radius: 0;
  `,
};

export const useGlobalStyles = () => {
  const { colors } = useCustomTheme();
  const scrollStyles = css`
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

  return { scrollStyles };
};
