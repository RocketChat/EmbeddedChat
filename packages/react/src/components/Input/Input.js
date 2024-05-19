import React from 'react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';
import InputStyles from './Input.styles';

const Input = ({ className = '', style = {}, textArea = false, ...props }) => {
  const { classNames, styleOverrides } = useComponentOverrides('Button');

  const InputElement = textArea ? 'textarea' : 'input';
  return (
    <InputElement
      css={InputStyles}
      className={`ec-input ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.string,
  textArea: PropTypes.bool,
};

export default Input;
