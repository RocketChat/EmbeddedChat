import { css } from '@emotion/react';
import { alpha } from '../../lib/color';
import useTheme from '../../hooks/useTheme';

const useInputStyles = () => {
  const { theme, colors } = useTheme();

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
    border-radius: ${theme.schemes.radius};
    box-shadow: none;
    border: 1px solid ${colors.border};
    outline: none;

    &:focus {
      outline: ${colors.ring} solid 1px;
    }

    &::placeholder {
      color: ${alpha(colors.foreground, 0.8)};
    }
  `;

  return { main };
};

export default useInputStyles;
