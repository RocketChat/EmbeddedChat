import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { createPortal } from 'react-dom';
import useTheme from '../../hooks/useTheme';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';
import MenuItem from './MenuItem';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { Tooltip } from '../Tooltip';
import { getMenuStyles } from './Menu.styles';

const MOBILE_BREAKPOINT = 499;
const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;
const POSITION_STYLE_PROPERTIES = new Set([
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'insetBlock',
  'insetBlockStart',
  'insetBlockEnd',
  'insetInline',
  'insetInlineStart',
  'insetInlineEnd',
]);

const useIsMobileViewport = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return undefined;
    }

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const onChange = (event) => setIsMobile(event.matches);

    setIsMobile(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', onChange);
    } else {
      mediaQuery.addListener(onChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', onChange);
      } else {
        mediaQuery.removeListener(onChange);
      }
    };
  }, []);

  return isMobile;
};

const getMobileStyle = (styleOverrides) =>
  Object.fromEntries(
    Object.entries(styleOverrides).filter(
      ([property]) => !POSITION_STYLE_PROPERTIES.has(property)
    )
  );

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
  const mobileStyle = useMemo(
    () => getMobileStyle(styleOverrides),
    [styleOverrides]
  );

  const { classNames: wrapperClasses, styleOverrides: wrapperStyles } =
    useComponentOverrides('MenuWrapper');

  const [isOpen, setOpen] = useState(false);
  const isMobile = useIsMobileViewport();
  const [portalTarget, setPortalTarget] = useState(null);
  const wrapperRef = useRef(null);
  const sheetRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();
  const menuLabel = tooltip.text || 'Options';

  const onClick = (action, disabled) => () => {
    if (!disabled) {
      action();
      setOpen(false);
    }
  };

  useEffect(() => {
    const embeddedChat = wrapperRef.current?.closest('.ec-embedded-chat');
    setPortalTarget(embeddedChat?.querySelector('#overlay-items') || null);
  }, []);

  useEffect(() => {
    const onBodyClick = (e) => {
      if (
        isOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        !sheetRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('click', onBodyClick);

    return () => {
      document.removeEventListener('click', onBodyClick);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isMobile || typeof document === 'undefined') {
      return undefined;
    }

    const previousActiveElement = document.activeElement;
    const triggerElement = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const firstMenuItem = sheetRef.current?.querySelector(
      '[data-menu-item]:not([aria-disabled="true"])'
    );
    (firstMenuItem || sheetRef.current)?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (triggerElement) {
        triggerElement.focus();
      } else if (previousActiveElement?.focus) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen, isMobile, portalTarget]);

  const onSheetKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }

    if (e.key !== 'Tab') {
      return;
    }

    const menuItems = Array.from(
      sheetRef.current?.querySelectorAll(
        '[data-menu-item]:not([aria-disabled="true"])'
      ) || []
    );

    if (menuItems.length === 0) {
      e.preventDefault();
      return;
    }

    const firstMenuItem = menuItems[0];
    const lastMenuItem = menuItems[menuItems.length - 1];

    if (e.shiftKey && document.activeElement === firstMenuItem) {
      e.preventDefault();
      lastMenuItem.focus();
    } else if (!e.shiftKey && document.activeElement === lastMenuItem) {
      e.preventDefault();
      firstMenuItem.focus();
    }
  };

  const triggerButtonProps = {
    ref: triggerRef,
    ghost: true,
    icon: 'kebab',
    size,
    'aria-label': menuLabel,
    'aria-expanded': isOpen,
    'aria-haspopup': isMobile ? 'dialog' : 'menu',
    'aria-controls': isOpen ? menuId : undefined,
    onClick: (e) => {
      e.stopPropagation();
      setOpen((prev) => !prev);
    },
  };

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
      <ActionButton {...triggerButtonProps} />
    </Tooltip>
  ) : (
    <ActionButton {...triggerButtonProps} />
  );

  const mobileMenu = (
    <>
      <Box
        css={portalTarget ? styles.backdropInContainer : styles.backdrop}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <Box
        ref={sheetRef}
        css={[
          styles.sheet,
          portalTarget && styles.sheetInContainer,
          css`
            box-shadow: ${theme.shadows[2]};
          `,
        ]}
        className={appendClassNames('ec-menu ec-menu-mobile', classNames)}
        id={menuId}
        role="dialog"
        aria-modal="true"
        aria-label={menuLabel}
        tabIndex={-1}
        style={mobileStyle}
        onKeyDown={onSheetKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        <Box role="menu" aria-label={menuLabel}>
          {menuItems}
        </Box>
      </Box>
    </>
  );

  const renderedMobileMenu = portalTarget
    ? createPortal(mobileMenu, portalTarget)
    : mobileMenu;

  const optionJsx = (
    <>
      {triggerButton}
      {isOpen && isMobile ? renderedMobileMenu : null}
      {isOpen && !isMobile ? (
        <Box
          css={[
            styles.container,
            css`
              box-shadow: ${theme.shadows[2]};
            `,
          ]}
          className={appendClassNames('ec-menu', classNames)}
          id={menuId}
          role="menu"
          aria-label={menuLabel}
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
