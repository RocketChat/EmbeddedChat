import { css } from '@emotion/react';
import { useTheme } from '../../hooks/useTheme';

const useCheckBoxStyles = (checked) => {
  const { theme, colors } = useTheme();

  const main = css`
    display: inline-block;
    color: ${colors.primaryForeground};
    background-color: ${checked ? colors.primary : 'none'};
    height: 1rem;
    width: 1rem;
    box-sizing: border-box;
    border: ${!checked ? `2px solid ${colors.border}` : `none`};
    border-radius: ${theme.schemes.radius};
    cursor: pointer;
    outline: none;
    &:active {
      outline: 0.3px solid ${colors.ring};
    }
  `;

  return { main };
};

export default useCheckBoxStyles;
