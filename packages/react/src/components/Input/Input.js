import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import useInputStyles from './Input.styles';

const Input = forwardRef(
  ({ className = '', style = {}, textArea = false, ...props }, ref) => {
    const { classNames, styleOverrides } = useComponentOverrides('Input');
    const styles = useInputStyles();
    const InputElement = textArea ? 'textarea' : 'input';
    return (
      <InputElement
        css={styles.main}
        className={`ec-${InputElement} ${className} ${classNames}`}
        style={{ ...styleOverrides, ...style }}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.string,
  textArea: PropTypes.bool,
};

Input.displayName = 'Input';

export default Input;
