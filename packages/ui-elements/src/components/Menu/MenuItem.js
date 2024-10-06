import React from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';

import useComponentOverrides from '../../hooks/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { getMenuItemStyles } from './Menu.styles';
import { useTheme } from '../../hooks';

const MenuItem = ({ icon, label, action, disabled }) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MenuItem',
    disabled && 'disabled'
  );
  const theme = useTheme();
  const styles = getMenuItemStyles(theme);

  return (
    <Box
      css={[styles.item, disabled && styles.disabled]}
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
