import React from 'react';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';
import styles from './StaticSelect.styles';

const StaticSelect = ({
  className = '',
  style = {},
  color = 'primary',
  options = [],
  placeholder = '',
  onChange,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('StaticSelect');
  const theme = useTheme();

  return (
    <select
      css={styles.select(theme, color)}
      className={`ec-static-select ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      onChange={onChange}
      {...props}
    >
      {placeholder && (
        <option value="" hidden>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

StaticSelect.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
};

export default StaticSelect;
