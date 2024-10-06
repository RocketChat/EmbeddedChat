import React from 'react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import useButtonStyles from './Button.styles';
import { useTheme } from '../../hooks';

const Button = ({
  children,
  type = 'primary',
  className = '',
  style = {},
  size = 'medium',
  square = false,
  ghost = false,
  disabled = false,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('Button');
  const { theme } = useTheme();
  const styles = useButtonStyles(theme);
  return (
    <button
      type="button"
      css={styles.main(type, size)}
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
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  style: PropTypes.object,
  square: PropTypes.bool,
  ghost: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default Button;
