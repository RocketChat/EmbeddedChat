import React from 'react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';
import useInputStyles from './Input.styles';

const Input = ({ className = '', style = {}, textArea = false, ...props }) => {
  const { classNames, styleOverrides } = useComponentOverrides('Button');
  const styles = useInputStyles();
  const InputElement = textArea ? 'textarea' : 'input';
  return (
    <InputElement
      css={styles.main}
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
