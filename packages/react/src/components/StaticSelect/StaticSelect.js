import React from 'react';
import { css, useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';

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

  const SelectCss = css`
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
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23111111" width="24px" height="24px"%3E%3Cpath d="M0 0h24v24H0z" fill="none"/%3E%3Cpath d="M7 10l5 5 5-5z" /%3E%3C/svg%3E');
    background-size: 24px;
    background-repeat: no-repeat;
    background-position: calc(100% - 8px) center;
    &:focus {
      border-color: ${theme.palette[color].main || 'currentColor'};
      box-shadow: 0px 0px 2.5px ${theme.palette[color].light || 'currentColor'};
    }
  `;

  return (
    <select
      css={SelectCss}
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
