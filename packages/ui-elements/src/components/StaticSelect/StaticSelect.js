import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Box } from '../Box';
import getStaticSelectStyles from './StaticSelect.styles';
import ListBox from '../ListBox/ListBox';
import Icon from '../Icon/Icon';
import { useTheme } from '../../hooks';

const StaticSelect = ({
  className = '',
  style = {},
  options = [],
  placeholder = '',
  value,
  onSelect,
  disabled = false,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('StaticSelect');
  const { theme } = useTheme();
  const styles = getStaticSelectStyles(theme);

  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState('');
  const staticSelectRef = useRef(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue) => {
    setInternalValue(optionValue);
    setIsOpen(false);
    if (onSelect) {
      onSelect(optionValue);
    }
  };

  useEffect(() => {
    setInternalValue(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        staticSelectRef.current &&
        !staticSelectRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Box
      className={`ec-static-select ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      ref={staticSelectRef}
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
          {!isOpen && internalValue
            ? options.find((option) => option.value === internalValue)?.label
            : placeholder}
        </Box>
        <Icon name="chevron-down" />
      </Box>

      {isOpen && (
        <ListBox
          options={options}
          onSelect={handleSelect}
          value={internalValue}
        />
      )}
    </Box>
  );
};

StaticSelect.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onSelect: PropTypes.func,
  disabled: PropTypes.bool,
};

export default StaticSelect;
