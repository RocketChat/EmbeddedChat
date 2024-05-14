import { css } from '@emotion/react';

const styles = {
  input: (theme, color) => css`
    position: relative;
    display: inline-flex;
    flex: 1 0 auto;
    min-width: 8rem;
    padding: 0.5rem 0.9375rem;
    -webkit-user-select: initial;
    -moz-user-select: initial;
    user-select: initial;
    vertical-align: baseline;
    white-space: nowrap;
    word-break: break-all;
    outline: 0;
    background-color: transparent;
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #2f343d;
    border-width: 1px;
    border-color: #cbced1;
    border-style: solid;
    border-radius: 0.25rem;
    background-color: white;
    box-shadow: none;
    transition: all 230ms;
    &:focus {
      border-color: ${theme.palette[color].main || 'currentColor'};
      box-shadow: 0px 0px 2.5px ${theme.palette[color].light || 'currentColor'};
    }
  `,
};

export default styles;
