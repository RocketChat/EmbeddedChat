import React from 'react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';
import styles from './Button.styles';

const getSquareSize = (size) => {
  if (size === 'small') {
    return '1.25rem';
  }
  if (size === 'large') {
    return '2.75rem';
  }
  return '2rem';
};

const Button = ({
  children,
  color = 'primary',
  className = '',
  style = {},
  size = 'medium',
  square = false,
  ghost = false,
  disabled = false,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('Button');

  return (
    <button
      type="button"
      css={styles(color, size, getSquareSize)}
      className={`ec-button ec-button--${size} ${
        square ? `ec-button-square` : ``
      } ${ghost ? 'ghost' : ''} ${
        disabled ? 'disabled' : ''
      } ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  style: PropTypes.object,
  square: PropTypes.bool,
  ghost: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Button;
