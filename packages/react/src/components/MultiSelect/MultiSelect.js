import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';
import styles from './MultiSelect.styles';

const MultiSelect = ({
  className = '',
  style = {},
  color = 'primary',
  options = [],
  onChange,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('MultiSelect');
  const theme = useTheme();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionToggle = (value) => {
    const isSelected = selectedOptions.includes(value);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((item) => item !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  return (
    <Box
      css={styles.multiSelect(theme, color)}
      className={`ec-multi-select ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      <Box>
        {options.map((option) => (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label key={option.value} css={styles.checkbox}>
            <input
              type="checkbox"
              value={option.value}
              checked={selectedOptions.includes(option.value)}
              onChange={() => handleOptionToggle(option.value)}
            />
            {option.label}
          </label>
        ))}
      </Box>
    </Box>
  );
};

MultiSelect.propTypes = {
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

export default MultiSelect;
