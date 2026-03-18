import React, { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import useTheme from '../../hooks/useTheme';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';
import MenuItem from './MenuItem';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { Tooltip } from '../Tooltip';
import { getMenuStyles } from './Menu.styles';

const MOBILE_BREAKPOINT = 499;

const getIsMobileViewport = () =>
  typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;

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
  const [isMobile, setIsMobile] = useState(getIsMobileViewport);
  const wrapperRef = useRef(null);

  const onClick = (action, disabled) => () => {
    if (!disabled) {
      action();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const onResize = () => {
      setIsMobile(getIsMobileViewport());
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const onBodyClick = (e) => {
      if (
        isOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('click', onBodyClick);

    return () => {
      document.removeEventListener('click', onBodyClick);
    };
  }, [isOpen]);

  const menuItems = options.map((option, idx) => (
    <MenuItem
      {...option}
      key={option.id || idx}
      action={onClick(option.action, option.disabled)}
      isMobile={isMobile}
    />
  ));

  const triggerButton = tooltip.isToolTip ? (
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
  );

  const optionJsx = (
    <>
      {triggerButton}
      {isOpen && isMobile ? (
        <>
          <Box css={styles.backdrop} onClick={() => setOpen(false)} />
          <Box
            css={[
              styles.sheet,
              css`
                box-shadow: ${theme.shadows[2]};
              `,
            ]}
            className={appendClassNames('ec-menu ec-menu-mobile', classNames)}
            style={styleOverrides}
            onClick={(e) => e.stopPropagation()}
          >
            {menuItems}
          </Box>
        </>
      ) : null}
      {isOpen && !isMobile ? (
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
          {menuItems}
        </Box>
      ) : null}
    </>
  );
  return useWrapper ? (
    <Box
      ref={wrapperRef}
      css={styles.wrapper}
      className={appendClassNames('ec-menu-wrapper', wrapperClasses)}
      style={wrapperStyles}
    >
      {optionJsx}
    </Box>
  ) : (
    <Box ref={wrapperRef}>{optionJsx}</Box>
  );
};

export default Menu;
