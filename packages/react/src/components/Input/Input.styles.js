import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';

const useInputStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const main = css`
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
    background-color: ${colors.background};
    color: ${colors.foreground};
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    border-radius: 0.25rem;
    box-shadow: none;
    border: 1px solid ${colors.input};
    outline: none;

    &:focus {
      outline: ${colors.ring} solid 1px;
    }
  `;

  return { main };
};

export default useInputStyles;
