import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';
import { darken } from '../../lib/color';

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
      width: 400px;
      height: 300px;
      max-width: 100%;
      max-height: 100%;
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

      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
    `,

    titleContainer: css`
      display: flex;
      gap: 0.25rem;
    `,
    icon: css`
      font-size: 1.25rem;
      padding: 0.1rem;
    `,

    searchContainer: css`
      display: flex;
      align-items: center;
      justify-content: space-around;
      border: 1px solid ${colors.border};
      border-radius: ${theme.schemes.radius};
      position: relative;
      margin: 0 1rem;
      &.focused {
        outline: 1px solid ${colors.ring};
      }
    `,

    textInput: css`
      height: 20px;
      border: none;
      flex: none;
      padding: none;
      &:focus {
        outline: none;
      }
    `,

    noInfoIcon: css`
      background: ${colors.background};
      padding: 0.125em;
      cursor: pointer;
    `,
  };

  return styles;
};
