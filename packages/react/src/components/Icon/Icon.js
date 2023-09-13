import React from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import icons from '@rocket.chat/icons';
import useComponentOverrides from '../../theme/useComponentOverrides';
import './rocketchat.css';

const Icon = ({
  size = 'inherit',
  name,
  className = '',
  style = {},
  ...props
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('Button');
  const iconCss = css`
    margin: 0;
    padding: 0;
    border-width: 0;
    border-style: solid;
    border-color: currentColor;
    outline: none;
    box-sizing: border-box;
    display: inline-block;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    vertical-align: middle;
    letter-spacing: 0;
    font-family: 'RocketChat';
    font-size: ${size};
    font-weight: 400;
    font-style: normal;
    font-variant: normal;
    line-height: 1;
    text-rendering: auto;
  `;
  return (
    <i
      aria-hidden="true"
      css={iconCss}
      className={`ec-icon ${className} ${`ec-icon--name-${name}`} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      {...props}
    >
      {icons[name]}
    </i>
  );
};

Icon.propTypes = {
  name: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Icon;
