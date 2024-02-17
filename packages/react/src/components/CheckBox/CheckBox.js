import React from 'react';
import { css, useTheme } from '@emotion/react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Icon } from '../Icon';
import { appendClassNames } from '../../lib/appendClassNames';

const CheckBox = ({ checked, ...props }) => {
  const theme = useTheme();
  const { classNames, styleOverrides } = useComponentOverrides('CheckBox');
  const CheckBoxCss = css`
    display: inline-block;
    color: ${theme.palette?.primary?.contrastText};
    background-color: ${checked ? theme.palette?.primary?.main : 'none'};
    height: 1.12rem;
    width: 1.12rem;
    box-sizing: border-box;
    border: ${!checked ? `1px solid #6c727a` : `none`};
    cursor: pointer;
    &:active {
      outline: 2px solid #6c727a33;
    }
  `;
  return (
    <label
      css={CheckBoxCss}
      className={appendClassNames('ec-check-box', classNames)}
      style={styleOverrides}
    >
      <input
        type="checkbox"
        {...props}
        checked={checked}
        style={{ display: 'none' }}
      />
      {checked ? (
        <Icon name="check" size="1.12rem" style={{ display: 'inline-block' }} />
      ) : null}
    </label>
  );
};

export default CheckBox;
