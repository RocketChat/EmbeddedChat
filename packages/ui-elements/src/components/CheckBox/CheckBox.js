import React, { useId, useState } from 'react';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { useTheme } from '../../hooks';
import { appendClassNames } from '../../lib/appendClassNames';
import getCheckBoxStyles from './CheckBox.styles';

const CheckBox = ({ checked, defaultChecked = false, onChange, ...props }) => {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internalChecked;
  const checkboxId = useId();

  const { theme } = useTheme();
  const styles = getCheckBoxStyles(theme);
  const { classNames, styleOverrides } = useComponentOverrides('CheckBox');

  const handleChange = (event) => {
    if (!isControlled) {
      setInternalChecked(event.target.checked);
    }

    onChange?.(event);
  };

  return (
    <label
      htmlFor={checkboxId}
      css={styles.main(isChecked)}
      className={appendClassNames('ec-check-box', classNames)}
      style={styleOverrides}
    >
      <input
        id={checkboxId}
        type="checkbox"
        {...props}
        checked={isChecked}
        onChange={handleChange}
        css={styles.input}
      />
      <Box
        is="span"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1rem',
          height: '1rem',
          verticalAlign: 'middle',
        }}
      >
        {isChecked && <Icon name="check" size="1rem" />}
      </Box>
    </label>
  );
};

export default CheckBox;
