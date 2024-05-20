import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';

const useCheckBoxStyles = (checked) => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const main = css`
    display: inline-block;
    color: ${colors.primaryForeground};
    background-color: ${checked ? colors.primary : 'none'};
    height: 1.12rem;
    width: 1.12rem;
    box-sizing: border-box;
    border: ${!checked ? `1px solid ${colors.primary}` : `none`};
    cursor: pointer;
    &:active {
      outline: 2px solid ${colors.ring};
    }
  `;

  return { main };
};

export default useCheckBoxStyles;
