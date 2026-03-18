import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import useTheme from '../../hooks/useTheme';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';
import MenuItem from './MenuItem';
import useComponentOverrides from '../../hooks/useComponentOverrides';
import { appendClassNames } from '../../lib/appendClassNames';
import { Tooltip } from '../Tooltip';
import { getMenuStyles } from './Menu.styles';

const MOBILE_BREAKPOINT = 768;

const DEFAULT_SECTION_ID = '__default';

const getOptionSection = (option) => {
  if (!option?.section) {
    return { id: DEFAULT_SECTION_ID, title: '' };
  }

  if (typeof option.section === 'string') {
    return { id: option.section, title: '' };
  }

  return {
    id: option.section.id || DEFAULT_SECTION_ID,
    title: option.section.title || '',
  };
};

const groupOptions = (options) =>
  options.reduce((sections, option) => {
    const section = getOptionSection(option);
    const existingSection = sections.find(({ id }) => id === section.id);

    if (existingSection) {
      existingSection.items.push(option);
      return sections;
    }

    sections.push({
      ...section,
      items: [option],
    });

    return sections;
  }, []);

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isMobile;
};

const Menu = ({
  options = [],
  className = '',
  style = {},
  anchor = 'right bottom',
  tooltip = { isToolTip: true, position: 'bottom', text: 'Options' },
  size = 'medium',
  useWrapper = true,
}) => {
  const { theme, mode } = useTheme();
  const styles = getMenuStyles({ theme, mode });
  const isMobile = useIsMobile();

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
  const groupedOptions = useMemo(() => groupOptions(options), [options]);

  const close = useCallback(() => setOpen(false), []);

  const onClick = (action, disabled) => () => {
    if (!disabled) {
      action();
      setOpen(false);
    }
  };

  // Close on outside click (desktop only — mobile uses backdrop)
  useEffect(() => {
    if (isMobile || !isOpen) return undefined;
    const onBodyClick = (e) => {
      if (!e.target.classList.contains('ec-menu-wrapper')) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onBodyClick);
    return () => document.removeEventListener('click', onBodyClick);
  }, [isOpen, isMobile]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

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

  // ── Mobile bottom sheet ──────────────────────────────────────────────────
  if (isMobile) {
    return (
      <Box
        css={styles.wrapper}
        className={appendClassNames('ec-menu-wrapper', wrapperClasses)}
        style={wrapperStyles}
      >
        {triggerButton}

        {isOpen && (
          <>
            {/* Backdrop */}
            <Box css={styles.backdrop} onClick={close} aria-hidden="true" />

            {/* Sheet */}
            <Box
              css={styles.sheet}
              className={appendClassNames('ec-menu ec-menu--sheet', classNames)}
              role="dialog"
              aria-modal="true"
              aria-label="Options"
            >
              {groupedOptions.map((section, sectionIndex) => (
                <Box css={styles.section} key={section.id || sectionIndex}>
                  {section.title ? (
                    <Box css={styles.sectionTitle}>{section.title}</Box>
                  ) : null}
                  {section.items.map((option, idx) => (
                    <MenuItem
                      {...option}
                      key={option.id || `${section.id}-${idx}`}
                      action={onClick(option.action, option.disabled)}
                      isMobile
                    />
                  ))}
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    );
  }

  // ── Desktop dropdown (unchanged) ─────────────────────────────────────────
  const optionJsx = (
    <>
      {triggerButton}
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
          {groupedOptions.map((section, sectionIndex) => (
            <Box css={styles.section} key={section.id || sectionIndex}>
              {section.title ? (
                <Box css={styles.sectionTitle}>{section.title}</Box>
              ) : null}
              {section.items.map((option, idx) => (
                <MenuItem
                  {...option}
                  key={option.id || `${section.id}-${idx}`}
                  action={onClick(option.action, option.disabled)}
                />
              ))}
            </Box>
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
