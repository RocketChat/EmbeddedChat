import React from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';

import useComponentOverrides from '../../hooks/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { getMenuItemStyles } from './Menu.styles';
import { useTheme } from '../../hooks';

const MenuItem = ({ icon, label, action, disabled, isMobile = false }) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MenuItem',
    disabled && 'disabled'
  );
  const theme = useTheme();
  const styles = getMenuItemStyles(theme);
  const handleKeyDown = (e) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      action();
    }
  };

  return (
    <Box
      is={isMobile ? 'button' : 'div'}
      type={isMobile ? 'button' : undefined}
      css={[
        isMobile ? styles.itemMobile : styles.item,
        disabled && styles.disabled,
      ]}
      className={appendClassNames('ec-menu-item', classNames)}
      style={styleOverrides}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      data-menu-item
      disabled={isMobile ? disabled : undefined}
      onClick={!disabled && action}
      onKeyDown={handleKeyDown}
    >
      <Icon name={icon} size={isMobile ? '1.25rem' : '1em'} />
      {label}
    </Box>
  );
};

export default MenuItem;
