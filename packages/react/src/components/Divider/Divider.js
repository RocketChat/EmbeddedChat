import React, { memo } from 'react';
import { css } from '@emotion/react';
import useComponentOverrides from '../../theme/useComponentOverrides';

// eslint-disable-next-line react/prop-types
const Divider = ({ className = '', style = {}, ...props }) => {
  const { classNames, styleOverrides } = useComponentOverrides('Divider');
  const DividerCss = css`
    height: 2px;
    margin: 0 8px 8px;
    border: 0;
    border-radius: 2px;
    background-color: #e4e7ea;
  `;
  return (
    <hr
      css={DividerCss}
      className={`ec-divider ${className} ${classNames}`}
      style={{ ...style, ...styleOverrides }}
      {...props}
    />
  );
};

export default memo(Divider);
