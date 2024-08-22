import { css } from '@emotion/react';
import useTheme from '../../hooks/useTheme';

const useDividerStyles = () => {
  const { theme, colors } = useTheme();
  const divider = css`
    height: 2px;
    margin: 0 8px 8px;
    border: 0;
    border-radius: ${theme.radius};
    background-color: ${colors.secondary};
  `;

  return { divider };
};

export default useDividerStyles;
