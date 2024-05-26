import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useStaticSelectStyles = () => {
  const { colors } = useCustomTheme();

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
    background-color: white;
    box-shadow: none;
    -webkit-appearance: none;
    appearance: none;
    transition: all 230ms;
    background-color: ${colors.background};

    &:focus {
      border-color: ${colors.ring};
    }
  `;

  return { main };
};

export default useStaticSelectStyles;
