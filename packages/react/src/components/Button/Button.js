/* eslint-disable react/button-has-type */
import React from 'react';
import { css, useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import useComponentOverrides from '../../theme/useComponentOverrides';

const Button = ({
  children,
  color = 'primary',
  className = '',
  style = {},
  size = 'medium',
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('Button');
  const theme = useTheme();
  const classNameButton = css`
    cursor: pointer;
    display: inline-block;
    background-color: ${theme.palette[color].main};
    color: ${theme.palette[color].contrastText || 'currentColor'};
    border-color: ${theme.palette[color].main || 'currentColor'};
    border-style: solid;
    border-width: 1px;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 1.25rem;
    min-width: 80px;
    outline: none;
    overflow: hidden;
    padding-block: calc(18px - 0.625rem);
    padding: calc(18px - 0.625rem) 14px;
    padding-inline: 14px;
    text-align: center;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-radius: 0.25rem;
    &.ec-button--small {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0;
      line-height: 1rem;
      min-width: 56px;
      padding-block: calc(12px - 0.5rem);
      padding: calc(12px - 0.5rem) 6px;
      padding-inline: 6px;
      border-radius: 0.25rem;
    }
    &.ec-button--large {
      font-size: 1rem;
      font-weight: 400;
      letter-spacing: 0;
      line-height: 1.5rem;
      min-width: 96px;
      padding-block: calc(22px - 0.75rem);
      padding: calc(22px - 0.75rem) 22px;
      padding-inline: 22px;
      border-radius: 0.36rem;
    }
    &:hover {
      filter: brightness(90%);
    }
  `;
  return (
    <button
      type="button"
      css={classNameButton}
      className={`ec-button ec-button--${size} ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Button;
