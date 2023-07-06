import React from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';

const Box = ({ children, className = '', style = {} }) => {
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
  return (
    <div
      css={classNameBox}
      className={`ec-box ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
    >
      {children}
    </div>
  );
};

Box.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Box;
