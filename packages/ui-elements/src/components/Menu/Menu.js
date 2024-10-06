import React, { useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import useTheme from '../../hooks/useTheme';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';
import MenuItem from './MenuItem';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { Tooltip } from '../Tooltip';
import { getMenuStyles } from './Menu.styles';

const Menu = ({
  options = [],
  className = '',
  style = {},
  anchor = 'right bottom',
  tooltip = { isToolTip: true, position: 'bottom', text: 'Options' },
  size = 'medium',
  useWrapper = true,
}) => {
  const { theme } = useTheme();
  const styles = getMenuStyles(theme);
  const { classNames, styleOverrides } = useComponentOverrides(
    'Menu',
    className,
    style
  );
  const anchorStyle = useMemo(() => {
    const positions = anchor.split(/\s+/);
    const styleAnchor = {};
    positions.forEach((pos) => {
      styleAnchor[pos] = 0;
    });
    return styleAnchor;
  }, [anchor]);

  const finalStyle = useMemo(
    () => ({ ...anchorStyle, ...styleOverrides }),
    [anchorStyle, styleOverrides]
  );

  const { classNames: wrapperClasses, styleOverrides: wrapperStyles } =
    useComponentOverrides('MenuWrapper');

  const [isOpen, setOpen] = useState(false);

  const onClick = (action, disabled) => () => {
    if (!disabled) {
      action();
      setOpen(!isOpen);
    }
  };

  useEffect(() => {
    const onBodyClick = (e) => {
      if (isOpen && !e.target.classList.contains('ec-menu-wrapper')) {
        setOpen(false);
      }
    };

    document.addEventListener('click', onBodyClick);

    return () => {
      document.removeEventListener('click', onBodyClick);
    };
  }, [isOpen]);

  const optionJsx = (
    <>
      {tooltip.isToolTip ? (
        <Tooltip text={tooltip.text} position={tooltip.position}>
          <ActionButton
            ghost
            icon="kebab"
            size={size}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          />
        </Tooltip>
      ) : (
        <ActionButton
          ghost
          icon="kebab"
          size={size}
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
        />
      )}
      {isOpen ? (
        <Box
          css={[
            styles.container,
            css`
              box-shadow: ${theme.shadows[2]};
            `,
          ]}
          className={appendClassNames('ec-menu', classNames)}
          style={finalStyle}
        >
          {options.map((option, idx) => (
            <MenuItem
              {...option}
              key={option.id || idx}
              action={onClick(option.action, option.disabled)}
            />
          ))}
        </Box>
      ) : null}
    </>
  );
  return useWrapper ? (
    <Box
      css={styles.wrapper}
      className={appendClassNames('ec-menu-wrapper', wrapperClasses)}
      style={wrapperStyles}
    >
      {optionJsx}
    </Box>
  ) : (
    optionJsx
  );
};

export default Menu;
