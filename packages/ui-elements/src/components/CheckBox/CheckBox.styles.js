import { css } from '@emotion/react';

const getCheckBoxStyles = (theme) => {
  const styles = {
    main: (checked) => css`
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
    `,
  };

  return styles;
};

export default getCheckBoxStyles;
