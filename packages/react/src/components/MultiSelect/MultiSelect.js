import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import useMultiSelectStyles from './MultiSelect.styles';
import { CheckBox } from '../CheckBox';

const MultiSelect = ({
  className = '',
  style = {},
  options = [],
  value,
  onChange,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('MultiSelect');
  const styles = useMultiSelectStyles();
  const [internalValue, setInternalValue] = useState([]);

  useEffect(() => {
    setInternalValue(value || []);
  }, [value]);

  const handleOptionToggle = (val) => {
    const isSelected = internalValue.includes(val);
    if (isSelected) {
      const newValue = internalValue.filter((item) => item !== val);
      setInternalValue(newValue);
      onChange(newValue);
    } else {
      const newValue = [...internalValue, val];
      setInternalValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <Box
      css={styles.main}
      className={`ec-multi-select ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      <Box css={styles.mainBox}>
        {options.map((option) => (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label key={option.value} css={styles.checkContainer}>
            <CheckBox
              type="checkbox"
              value={option.value}
              checked={internalValue.includes(option.value)}
              onChange={() => handleOptionToggle(option.value)}
              css={styles.checkbox}
            />
            <Box
              css={css`
                padding: 0 0.3rem;
              `}
            >
              {option.label}
            </Box>
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
