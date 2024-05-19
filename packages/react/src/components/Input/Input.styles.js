import { css, useTheme } from '@emotion/react';
import { useUserStore } from '../../store';

const InputStyles = () => {
  const theme = useTheme();
  const dark = useUserStore((state) => state.dark);
  const mode = dark ? 'dark' : 'light';
  return css`
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
    background-color: ${theme.schemes[mode].background};
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color:${theme.schemes[mode].foreground};
    border-width: 1px;
    border-color: ${theme.schemes[mode].input}
    border-style: solid;
    border-radius: 0.25rem;
    box-shadow: none;
    transition: all 230ms;
    &:focus {
      border-color: ${theme.schemes[mode].ring};
      box-shadow: 0px 0px 2.5px ${
        theme.schemes[mode].primary || 'currentColor'
      };
    }
  `;
};

export default InputStyles;
