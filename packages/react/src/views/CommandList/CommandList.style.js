import { css } from '@emotion/react';
import { alpha } from '../../lib/color';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useCommandListStyles = () => {
  const { theme, colors } = useCustomTheme();
  const main = css`
    margin: 0.2rem 2rem;
    padding: 0.5rem 0.3rem;
    display: block;
    max-height: 10rem;
    overflow: scroll;
    overflow-x: hidden;
    max-height: 145px;
    border: 1px solid ${colors.border};
    border-radius: ${theme.schemes.radius};
    color: ${colors.secondaryForeground};
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

  const listItem = css`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background-color: ${colors.secondary};
    }
  `;

  const listText = css`
    font-weight: 600;
  `;

  return { main, listItem, listText };
};

export default useCommandListStyles;
