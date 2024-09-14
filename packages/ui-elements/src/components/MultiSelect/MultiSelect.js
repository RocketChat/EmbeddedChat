import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import { Icon } from '../Icon';
import ListBox from '../ListBox/ListBox';
import getMultiSelectStyles from './MultiSelect.styles';
import { useTheme } from '../../hooks';

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
  const { theme } = useTheme();
  const styles = getMultiSelectStyles(theme);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        multiSelectRef.current &&
        !multiSelectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

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
        <Box css={styles.selectedItemsContainer}>
          {internalValue.length > 0 ? (
            internalValue.map((item, index) => (
              <Box is="span" key={index} css={styles.selectedItems}>
                {options.find((option) => option.value === item)?.label || item}
              </Box>
            ))
          ) : (
            <Box is="span">{placeholder}</Box>
          )}
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
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
  value: PropTypes.array,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default MultiSelect;
