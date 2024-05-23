import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useCheckBoxStyles = (checked) => {
  const { colors } = useCustomTheme();

  const main = css`
    display: inline-block;
    color: ${colors.primaryForeground};
    background-color: ${checked ? colors.primary : 'none'};
    height: 1rem;
    width: 1rem;
    box-sizing: border-box;
    border: ${!checked ? `1px solid ${colors.primary}` : `none`};
    border-radius: 4px;
    cursor: pointer;
    outline: none;
    &:active {
      outline: 0.3px solid ${colors.ring};
    }
  `;

  return { main };
};

export default useCheckBoxStyles;
