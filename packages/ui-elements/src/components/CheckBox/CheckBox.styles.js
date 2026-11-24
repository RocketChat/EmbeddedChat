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
      border: ${!checked ? `2px solid ${theme.colors.border}` : 'none'};
      border-radius: ${theme.radius};
      cursor: pointer;

      &:active {
        outline: 0.3px solid ${theme.colors.ring};
      }
    `,

    input: css`
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;

      &:focus-visible + span {
        outline: 2px solid ${theme.colors.ring};
        outline-offset: 3px;
        border-radius: ${theme.radius};
      }
    `,
  };

  return styles;
};

export default getCheckBoxStyles;
