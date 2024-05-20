import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';

const useMultiSelectStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const main = css`
    position: relative;
    display: inline-flex;
    flex: 1 0 auto;
    min-width: 8rem;
    padding: 0.5rem 0.9375rem;
    vertical-align: baseline;
    outline: 0;
    background-color: transparent;
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    overflow: hidden;
    color: ${colors.foreground};
    border-right: 0.9375rem transparent;
    border-width: 1px;
    border-color: ${colors.border};
    border-style: solid;
    border-radius: 0.25rem;
    background-color: ${colors.background};
    box-shadow: none;
    -webkit-appearance: none;
    appearance: none;
    transition: all 230ms;
    &:focus {
      border-color: ${colors.ring};
    }
  `;

  const checkbox = css`
    cursor: pointer;
  `;

  const checkContainer = css`
    padding: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const mainBox = css`
    display: flex;
  `;

  return { main, checkbox, checkContainer, mainBox };
};

export default useMultiSelectStyles;
