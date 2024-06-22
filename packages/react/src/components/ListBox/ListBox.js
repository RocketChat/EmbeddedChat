/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { Box } from '../Box';
import { CheckBox } from '../CheckBox';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import useListBoxStyles from './ListBox.styles';
import { useCustomTheme } from '../../hooks/useCustomTheme';

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
  const styles = useListBoxStyles();
  const { colors } = useCustomTheme();
  const itemRefs = useRef([]);
  const [optionIndex, setOptionIndex] = useState(0);

  const setItemRef = (el, index) => {
    itemRefs.current[index] = el;
  };

  const handleOptionClick = useCallback(
    (option) => {
      console.log(option);
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
            key={index}
            role="presentation"
            css={styles.listItem}
            ref={(el) => setItemRef(el, index)}
            onClick={() => handleOptionClick(option)}
            style={{
              backgroundColor: index === optionIndex && colors.primary,
              color: index === optionIndex && colors.primaryForeground,
            }}
          >
            {multi ? (
              <label key={option.value} css={styles.checkContainer}>
                <CheckBox
                  type="checkbox"
                  value={option.value}
                  defaultChecked={value?.includes(option.value)}
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
  options: PropTypes.array.isRequired,
};

export default ListBox;
