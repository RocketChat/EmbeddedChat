import React, { useState } from 'react';
import { css, useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Box } from '../Box';

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

  const MultiSelectCss = css`
    position: relative;
    display: inline-flex;
    flex: 1 0 auto;
    min-width: 8rem;
    padding: 0.5rem 0.9375rem;
    vertical-align: baseline;
    outline: 0;
    background-color: transparent;
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    overflow: hidden;
    color: #2f343d;
    border-right: 0.9375rem transparent;
    border-width: 1px;
    border-color: #cbced1;
    border-style: solid;
    border-radius: 0.25rem;
    background-color: white;
    box-shadow: none;
    -webkit-appearance: none;
    appearance: none;
    transition: all 230ms;
    &:focus {
      border-color: ${theme.palette[color].main || 'currentColor'};
      box-shadow: 0px 0px 2.5px ${theme.palette[color].light || 'currentColor'};
    }
  `;

  const CheckboxCss = css`
    margin-right: 8px;
    cursor: pointer;
  `;

  return (
    <Box
      css={MultiSelectCss}
      className={`ec-multi-select ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      <Box>
        {options.map((option) => (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label key={option.value} css={CheckboxCss}>
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
