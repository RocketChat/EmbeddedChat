import { css } from '@emotion/react';
import useTheme from '../../hooks/useTheme';

const useCheckBoxStyles = (checked) => {
  const { theme } = useTheme();

  const main = css`
    display: inline-block;
    color: ${theme.colors.primaryForeground};
    background-color: ${checked ? theme.colors.primary : 'none'};
    height: 1rem;
    width: 1rem;
    box-sizing: border-box;
    border: ${!checked ? `2px solid ${theme.colors.border}` : `none`};
    border-radius: ${theme.radius};
    cursor: pointer;
    outline: none;
    &:active {
      outline: 0.3px solid ${theme.colors.ring};
    }
  `;

  return { main };
};

export default useCheckBoxStyles;
