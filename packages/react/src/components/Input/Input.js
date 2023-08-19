import React from 'react';
import { css, useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';

const Input = ({ className = '', style = {}, color = 'primary', ...props }) => {
  const { classNames, styleOverrides } = useComponentOverrides('Button');
  const theme = useTheme();
  const InputCss = css`
    position: relative;
    display: inline-flex;
    flex: 1 0 auto;
    min-width: 8rem;
    padding: 0.5rem 0.9375rem;
    -webkit-user-select: initial;
    -moz-user-select: initial;
    user-select: initial;
    vertical-align: baseline;
    white-space: nowrap;
    word-break: break-all;
    outline: 0;
    background-color: transparent;
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #2f343d;
    border-width: 1px;
    border-color: #cbced1;
    border-style: solid;
    border-radius: 0.25rem;
    background-color: white;
    box-shadow: none;
    transition: all 230ms;
    &:focus {
      border-color: ${theme.palette[color].main || 'currentColor'};
      box-shadow: 0px 0px 2.5px ${theme.palette[color].light || 'currentColor'};
    }
  `;
  return (
    <input
      css={InputCss}
      className={`ec-input ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  color: PropTypes.string,
};

export default Input;
