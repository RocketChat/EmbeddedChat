import React from 'react';
import { useTheme } from '@emotion/react';
import { Box } from '../Box';
import { Icon } from '../Icon';

import useComponentOverrides from '../../theme/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { MenuItemStyles as styles } from './Menu.styles';

const MenuItem = ({ icon, label, action, disabled, color }) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MenuItem',
    disabled && 'disabled'
  );
  const theme = useTheme();

  return (
    <Box
      css={[
        styles.item,
        styles.themed(theme, color),
        disabled && styles.disabled,
      ]}
      className={appendClassNames('ec-menu-item', classNames)}
      style={styleOverrides}
      onClick={!disabled && action}
    >
      <Icon name={icon} size="1em" />
      {label}
    </Box>
  );
};

export default MenuItem;
