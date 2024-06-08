import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';
import { lighten, darken } from '../../lib/color';

export const usePopupStyles = () => {
  const { theme, colors } = useCustomTheme();

  const styles = {
    popup: css`
      display: flex;
      flex-direction: column;
      z-index: ${theme.zIndex.modal};
      box-shadow: ${theme.shadows[2]};
      border-radius: ${theme.schemes.radius};
      background: ${colors.background};
    `,
  };

  return styles;
};

export const usePopupHeaderStyles = () => {
  const { theme, mode, colors } = useCustomTheme();
  const styles = {
    popupHeader: css`
      background-color: ${mode === 'light'
        ? darken(colors.background, 0.03)
        : colors.secondary};
    `,
  };

  return styles;
};
