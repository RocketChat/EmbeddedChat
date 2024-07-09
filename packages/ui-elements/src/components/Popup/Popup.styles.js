import { css } from '@emotion/react';
import useTheme from '../../hooks/useTheme';
import { darken } from '../../lib/color';

export const usePopupStyles = () => {
  const { theme, colors } = useTheme();

  const styles = {
    popup: (width, height) => css`
      display: flex;
      flex-direction: column;
      z-index: ${theme.zIndex.modal};
      box-shadow: ${theme.shadows[2]};
      border-radius: ${theme.schemes.radius};
      background: ${colors.background};
      border: 1px solid ${colors.border};
      width: ${width};
      height: ${height};
    `,

    popupContent: css`
      overflow: auto;
      overflow-x: hidden;
    `,
  };
  return styles;
};

export const usePopupHeaderStyles = () => {
  const { theme, mode, colors } = useTheme();
  const styles = {
    popupHeader: css`
      background-color: ${mode === 'light'
        ? darken(colors.background, 0.03)
        : colors.secondary};

      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      margin-bottom: 0.5rem;
      border-top-left-radius: inherit;
      border-top-right-radius: inherit;
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
