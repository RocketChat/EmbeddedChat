import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import styles from './Box.style';

const Box = forwardRef(
  (
    { children = null, className = '', style = {}, is = 'div', ...props },
    ref
  ) => {
    const { classNames, styleOverrides } = useComponentOverrides('Box');

    const Element = `${is}`;
    return (
      <Element
        ref={ref}
        css={styles.box}
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
