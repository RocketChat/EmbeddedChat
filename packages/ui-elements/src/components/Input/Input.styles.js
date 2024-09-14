import { css } from '@emotion/react';
import { alpha } from '../../lib/color';

const getInputStyles = (theme) => {
  const styles = {
    main: css`
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
      background-color: ${theme.colors.background};
      color: ${theme.colors.foreground};
      letter-spacing: 0rem;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      border-radius: ${theme.radius};
      box-shadow: none;
      border: 1px solid ${theme.colors.border};
      outline: none;

      &:focus {
        outline: ${theme.colors.ring} solid 1px;
      }

      &::placeholder {
        color: ${alpha(theme.colors.foreground, 0.8)};
      }
    `,
  };

  return styles;
};

export default getInputStyles;
