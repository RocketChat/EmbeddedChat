import { css } from '@emotion/react';

const styles = {
  checkBox: (theme, checked) => css`
    display: inline-block;
    color: ${theme.palette?.primary?.contrastText};
    background-color: ${checked ? theme.palette?.primary?.main : 'none'};
    height: 1.12rem;
    width: 1.12rem;
    box-sizing: border-box;
    border: ${!checked ? `1px solid #6c727a` : `none`};
    cursor: pointer;
    &:active {
      outline: 2px solid #6c727a33;
    }
  `,
};

export default styles;
