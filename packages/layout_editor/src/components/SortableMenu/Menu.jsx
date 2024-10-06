import React, { useMemo, useState } from 'react';
import { css } from '@emotion/react';
import {
  Box,
  ActionButton,
  Tooltip,
  useTheme,
} from '@embeddedchat/ui-elements';
import MenuItem from './MenuItem';
import { getMenuStyles } from './Menu.styles';
import { SortableContext } from '@dnd-kit/sortable';

const Menu = ({
  options = [],
  tooltip = { isToolTip: true, position: 'bottom', text: 'Options' },
  from = 'top',
  size = 'medium',
  ...props
}) => {
  const theme = useTheme();
  const styles = getMenuStyles(theme);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const anchorStyle = useMemo(() => {
    const positions = from.split(/\s+/);
    const styleAnchor = {};
    positions.forEach((pos) => {
      styleAnchor[pos] = '120%';
    });
    return styleAnchor;
  }, [from]);

  const handleMenuVisibility = () => {
    setIsMenuVisible((prev) => !prev);
  };

  return (
    <Box>
      <Tooltip text={tooltip.text} position={tooltip.position}>
        <ActionButton
          ghost
          icon="kebab"
          size={size}
          onClick={handleMenuVisibility}
        />
      </Tooltip>

      {isMenuVisible && (
        <Box
          css={[
            styles.container,
            css`
              box-shadow: ${theme.theme.shadows[2]};
            `,
          ]}
          style={anchorStyle}
        >
          <SortableContext items={options}>
            {options.map((option, idx) => (
              <MenuItem {...option} key={option.id || idx} {...props} />
            ))}
          </SortableContext>
        </Box>
      )}
    </Box>
  );
};

export default Menu;
