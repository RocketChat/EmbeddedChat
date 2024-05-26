import React from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';

import useComponentOverrides from '../../theme/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { useMenuItemStyles } from './Menu.styles';

const MenuItem = ({ icon, label, action, disabled }) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MenuItem',
    disabled && 'disabled'
  );
  const styles = useMenuItemStyles();

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
