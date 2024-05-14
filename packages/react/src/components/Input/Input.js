import React from 'react';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';
import styles from './Input.styles';

const Input = ({
  className = '',
  style = {},
  color = 'primary',
  textArea = false,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('Button');
  const theme = useTheme();

  const InputElement = textArea ? 'textarea' : 'input';
  return (
    <InputElement
      css={styles.input(theme, color)}
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
