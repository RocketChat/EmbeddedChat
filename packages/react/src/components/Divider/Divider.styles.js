import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useDividerStyles = () => {
  const { colors } = useCustomTheme();
  const divider = css`
    height: 2px;
    margin: 0 8px 8px;
    border: 0;
    border-radius: 2px;
    background-color: ${colors.secondary};
  `;

  return { divider };
};

export default useDividerStyles;
