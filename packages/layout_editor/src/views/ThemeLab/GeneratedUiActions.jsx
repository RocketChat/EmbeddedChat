import React, { useEffect, useId, useRef, useState } from 'react';
import { Box, Icon } from '@embeddedchat/ui-elements';

const GeneratedUiActions = ({
  styles,
  disabled,
  onApply,
  onCopy,
  onDownload,
  onReset,
}) => {
  const [isExportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const initialItem = useRef(0);
  const menuId = useId();
  const triggerId = useId();

  useEffect(() => {
    if (disabled) setExportOpen(false);
  }, [disabled]);

  useEffect(() => {
    if (!isExportOpen) return undefined;
    menuRef.current?.querySelectorAll('button')[initialItem.current]?.focus();
    const dismissOutside = (event) => {
      if (!exportRef.current?.contains(event.target)) setExportOpen(false);
    };
    document.addEventListener('pointerdown', dismissOutside);
    return () => document.removeEventListener('pointerdown', dismissOutside);
  }, [isExportOpen]);

  const closeExport = () => {
    setExportOpen(false);
    triggerRef.current?.focus();
  };

  const handleMenuKeyDown = (event) => {
    if (event.key === 'Escape' || event.key === 'Tab') {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
      }
      // Restore the trigger before native Tab navigation leaves the menu.
      closeExport();
      return;
    }
    const items = Array.from(menuRef.current.querySelectorAll('button'));
    const index = items.indexOf(document.activeElement);
    const nextIndex = {
      ArrowDown: (index + 1) % items.length,
      ArrowUp: (index + items.length - 1) % items.length,
      Home: 0,
      End: items.length - 1,
    }[event.key];
    if (nextIndex !== undefined) {
      event.preventDefault();
      items[nextIndex].focus();
    }
  };

  return (
    <Box css={styles.actionsFooter}>
      <Box css={styles.actionsRow}>
        <button
          type="button"
          css={[
            styles.actionButton,
            styles.secondaryAction,
            styles.applyAction,
          ]}
          onClick={onApply}
          disabled={disabled}
          title="Apply to editor preview"
        >
          Apply to editor
        </button>
        <Box
          ref={exportRef}
          css={styles.exportControl}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setExportOpen(false);
          }}
        >
          <button
            ref={triggerRef}
            id={triggerId}
            type="button"
            css={[styles.actionButton, styles.exportAction]}
            disabled={disabled}
            aria-haspopup="menu"
            aria-expanded={isExportOpen}
            aria-controls={isExportOpen ? menuId : undefined}
            onClick={() => {
              initialItem.current = 0;
              setExportOpen((current) => !current);
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                initialItem.current = event.key === 'ArrowUp' ? 1 : 0;
                setExportOpen(true);
              }
            }}
          >
            Export
            <Icon name="chevron-down" size="1rem" aria-hidden="true" />
          </button>
          {isExportOpen && !disabled && (
            <Box
              ref={menuRef}
              id={menuId}
              role="menu"
              aria-labelledby={triggerId}
              css={styles.exportMenu}
              onKeyDown={handleMenuKeyDown}
            >
              {[
                ['Download JSON', 'download', onDownload],
                ['Copy Config', 'copy', onCopy],
              ].map(([label, icon, action]) => (
                <button
                  key={label}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  css={styles.exportMenuItem}
                  onClick={() => {
                    closeExport();
                    action();
                  }}
                >
                  <Icon name={icon} size="1rem" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </Box>
          )}
        </Box>
      </Box>
      <button type="button" css={styles.resetBtn} onClick={onReset}>
        Reset
      </button>
    </Box>
  );
};

export default GeneratedUiActions;
