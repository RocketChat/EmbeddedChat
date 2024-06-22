import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { Icon } from '../Icon';
import ListBox from '../ListBox/ListBox';
import useMultiSelectStyles from './MultiSelect.styles';

const MultiSelect = ({
  className = '',
  style = {},
  options = [],
  value,
  placeholder = '',
  disabled = false,
  onChange,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('MultiSelect');
  const styles = useMultiSelectStyles();
  const [internalValue, setInternalValue] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const multiSelectRef = useRef(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    setInternalValue(value || []);
  }, [value]);

  const handleSelect = (val) => {
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
      className={`ec-multi-select ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      ref={multiSelectRef}
      css={styles.main}
    >
      <Box
        onClick={toggleDropdown}
        css={[
          styles.selectBox,
          isOpen && styles.clickStyle,
          disabled && styles.disabled,
        ]}
        {...props}
      >
        <Box is="span" className="selected-option">
          {placeholder}
        </Box>
        <Icon name="chevron-down" />
      </Box>

      {isOpen && (
        <ListBox
          options={options}
          onSelect={handleSelect}
          value={internalValue}
          multi
        />
      )}
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
