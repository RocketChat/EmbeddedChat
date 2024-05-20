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
    outline: 0;
    background-color: ${colors.background};
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color:${colors.foreground};
    border-width: 1px;
    border-color: ${colors.input}
    border-style: solid;
    border-radius: 0.25rem;
    box-shadow: none;
    transition: all 230ms;
    &:focus {
      border-color: ${colors.ring};
      box-shadow: 0px 0px 2.5px ${colors.primary || 'currentColor'};
    }
  `;

  return { main };
};

export default useInputStyles;
