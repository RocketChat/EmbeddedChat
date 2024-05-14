import React from 'react';
import { useTheme } from '@emotion/react';
import useComponentOverrides from '../../theme/useComponentOverrides';
import { Icon } from '../Icon';
import { appendClassNames } from '../../lib/appendClassNames';
import styles from './CheckBox.styles';

const CheckBox = ({ checked, ...props }) => {
  const theme = useTheme();
  const { classNames, styleOverrides } = useComponentOverrides('CheckBox');

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      css={styles.checkBox(theme, checked)}
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
