import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useDividerStyles = () => {
  const { theme, colors } = useCustomTheme();
  const divider = css`
    height: 2px;
    margin: 0 8px 8px;
    border: 0;
    border-radius: ${theme.schemes.radius};
    background-color: ${colors.secondary};
  `;

  return { divider };
};

export default useDividerStyles;
