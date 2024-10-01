import React, { useEffect, useState, useRef, useCallback } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import { CheckBox } from '../CheckBox';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import getListBoxStyles from './ListBox.styles';
import useTheme from '../../hooks/useTheme';

const findIndex = (options, value, multi) => {
  if (multi) return 0;
  if (value) {
    const index = options.findIndex((option) => option.value === value);
    return index !== -1 ? index : 0;
  }
  return 0;
};

const ListBox = ({
  className = '',
  style = {},
  onSelect,
  options = [],
  multi = false,
  value,
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ListBox');
  const { theme } = useTheme();
  const styles = getListBoxStyles(theme);
  const itemRefs = useRef([]);
  const [optionIndex, setOptionIndex] = useState(() =>
    findIndex(options, value, multi)
  );

  const setItemRef = (el, index) => {
    itemRefs.current[index] = el;
  };

  const handleOptionClick = useCallback(
    (option) => {
      if (onSelect) {
        onSelect(option.value);
      }
    },
    [onSelect]
  );

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'Enter': {
          handleOptionClick(options[optionIndex]);
          break;
        }
        case 'ArrowDown':
          event.preventDefault();
          setOptionIndex((prevIndex) =>
            prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setOptionIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : prevIndex
          );
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [options, optionIndex, handleOptionClick]);

  useEffect(() => {
    if (itemRefs.current[optionIndex]) {
      itemRefs.current[optionIndex].scrollIntoView({
        block: 'nearest',
      });
    }
  }, [optionIndex]);

  useEffect(() => {
    setOptionIndex(findIndex(options, value, multi));
  }, [multi, options, value]);

  return (
    <Box
      css={styles.main}
      className={`ec-list-box ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {options.map((option, index) => (
          <li
            key={option.value}
            role="presentation"
            css={styles.listItem}
            ref={(el) => setItemRef(el, index)}
            onClick={() => handleOptionClick(option)}
            style={{
              backgroundColor: index === optionIndex && theme.colors.primary,
              color: index === optionIndex && theme.colors.primaryForeground,
            }}
          >
            {multi ? (
              <Box
                css={css`
                  display: flex;
                  gap: 0.25rem;
                `}
              >
                <CheckBox
                  value={option.value}
                  css={styles.checkbox}
                  checked={value?.includes(option.value)}
                  onChange={() => {}}
                />
                <Box
                  css={css`
                    padding: 0 0.3rem;
                  `}
                >
                  {option.label}
                </Box>
              </Box>
            ) : (
              <Box is="span">{option.label}</Box>
            )}
          </li>
        ))}
      </ul>
    </Box>
  );
};

ListBox.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  onSelect: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  multi: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
  ]),
};

export default ListBox;
