import React from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { useTheme } from '../../hooks';
import { appendClassNames } from '../../lib/appendClassNames';
import getCheckBoxStyles from './CheckBox.styles';

const CheckBox = ({ checked, ...props }) => {
  const { theme } = useTheme();
  const styles = getCheckBoxStyles(theme);
  const { classNames, styleOverrides } = useComponentOverrides('CheckBox');

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      css={styles.main(checked)}
      className={appendClassNames('ec-check-box', classNames)}
      style={styleOverrides}
    >
      <input
        type="checkbox"
        {...props}
        checked={checked}
        style={{ display: 'none' }}
      />
      <Box
        is="span"
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      >
        {checked && <Icon name="check" size="1rem" />}
      </Box>
    </label>
  );
};

export default CheckBox;
