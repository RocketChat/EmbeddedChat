import React from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';

import useComponentOverrides from '../../hooks/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { getMenuItemStyles } from './Menu.styles';
import { useTheme } from '../../hooks';

const MenuItem = ({
  icon,
  label,
  action,
  disabled,
  isMobile = false,
  color,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MenuItem',
    disabled && 'disabled'
  );
  const theme = useTheme();
  const styles = getMenuItemStyles(theme);
  const isDestructive = color === 'destructive' || color === 'error';

  return (
    <Box
      css={[
        isMobile ? styles.itemMobile : styles.item,
        isDestructive && styles.destructive,
        disabled && styles.disabled,
      ]}
      className={appendClassNames('ec-menu-item', classNames)}
      style={styleOverrides}
      onClick={!disabled && action}
    >
      <Icon name={icon} size={isMobile ? '1.25rem' : '1rem'} />
      {label}
    </Box>
  );
};

export default MenuItem;
