import React from 'react';
import alpha from 'color-alpha';
import { css, useTheme } from '@emotion/react';
import { Box } from '../Box';
import { Icon } from '../Icon';

import useComponentOverrides from '../../theme/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';

const MenuItemCss = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding: 0.25em;
  white-space: nowrap;
  gap: 0.2rem;
`;

const MenuItem = ({ icon, label, action, disabled, color }) => {
  const { classNames, styleOverrides } = useComponentOverrides(
    'MenuItem',
    disabled && 'disabled'
  );
  const theme = useTheme();
  const themedCss = css`
    color: ${theme.palette?.[color]?.main || color};
    &:hover {
      background-color: ${theme.palette?.grey?.main || '#E7EBF0'};
      ${theme.palette?.[color]?.main || color
        ? `background-color: ${alpha(
            theme.palette?.[color]?.main || color,
            0.075
          )}`
        : ''};
      cursor: pointer;
    }
  `;
  const DisabledCss = css`
    cursor: not-allowed !important;
    color: ${theme.palette?.grey?.contrastText || '#6F7E8C'};
  `;
  return (
    <Box
      css={[MenuItemCss, themedCss, disabled && DisabledCss]}
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
