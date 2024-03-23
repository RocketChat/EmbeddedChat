import React, { forwardRef } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';

const Box = forwardRef(
  (
    { children = null, className = '', style = {}, is = 'div', ...props },
    ref
  ) => {
    const { classNames, styleOverrides } = useComponentOverrides('Box');
    const classNameBox = css`
      margin: 0;
      padding: 0;
      border-width: 0;
      box-sizing: border-box;
      border-style: solid;
      border-color: currentColor;
      outline: none;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      flex: 0 1 auto;
    `;
    const Element = `${is}`;
    return (
      <Element
        ref={ref}
        css={classNameBox}
        className={`ec-box ${className} ${classNames}`}
        style={{ ...styleOverrides, ...style }}
        {...props}
      >
        {children}
      </Element>
    );
  }
);

Box.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
  is: PropTypes.string,
};

Box.displayName = 'Box';
export default Box;
