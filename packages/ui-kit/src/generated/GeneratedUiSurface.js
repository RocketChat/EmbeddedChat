import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { css } from '@emotion/react';
import { Box, Icon, Modal, useTheme } from '@embeddedchat/ui-elements';
import { UiKitContext } from '../contexts/UiKitContext';
import { extractInitialStateFromLayout } from '../utils/extractInitialStateFromLayout';
import { validateGeneratedUiConfiguration } from '../utils/generatedUiConfig';
import { UiKitContextualBar, UiKitMessage, UiKitModal } from '../surfaces';

const ErrorMessage = ({ children }) => {
  const { theme } = useTheme();
  return (
    <Box
      role="alert"
      style={{ color: theme.colors.destructive, overflowWrap: 'anywhere' }}
    >
      {children}
    </Box>
  );
};

class RenderErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    return this.state.error ? (
      <ErrorMessage>
        This component could not be rendered. Check its configuration and try
        again.
      </ErrorMessage>
    ) : (
      this.props.children
    );
  }
}

const GeneratedUiSession = ({
  configuration,
  placement,
  roomId,
  messageId,
  onAction,
}) => {
  const [values, setValues] = useState(() =>
    extractInitialStateFromLayout(configuration.blocks)
  );
  const valuesRef = useRef(values);
  const pending = useRef(false);
  const mounted = useRef(true);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const updateState = useCallback((nextValue) => {
    if (!nextValue?.actionId) return;
    valuesRef.current = {
      ...valuesRef.current,
      [nextValue.actionId]: {
        value: nextValue.value,
        blockId: nextValue.blockId,
      },
    };
    setValues(valuesRef.current);
  }, []);

  const dispatchAction = useCallback(
    async (action, event) => {
      if (typeof onAction !== 'function' || pending.current) return;
      pending.current = true;
      setBusy(true);
      setActionError(null);
      const snapshot = Object.fromEntries(
        Object.entries(valuesRef.current).map(([id, state]) => [
          id,
          state.value,
        ])
      );
      try {
        await onAction(
          {
            ...action,
            id: configuration.id,
            title: configuration.title,
            componentType: configuration.componentType,
            surface: configuration.surface,
            placement,
            roomId,
            messageId,
            values: snapshot,
          },
          event
        );
      } catch (error) {
        if (mounted.current)
          setActionError(
            error?.message || 'The action failed. Please try again.'
          );
      } finally {
        pending.current = false;
        if (mounted.current) setBusy(false);
      }
    },
    [configuration, placement, roomId, messageId, onAction]
  );

  const contextValue = useMemo(
    () => ({ action: dispatchAction, updateState, values, busy }),
    [dispatchAction, updateState, values, busy]
  );
  const render =
    configuration.surface === 'modal'
      ? UiKitModal
      : configuration.surface === 'contextualBar'
      ? UiKitContextualBar
      : UiKitMessage;
  return (
    <UiKitContext.Provider value={contextValue}>
      <Box aria-busy={busy}>
        {configuration.blocks.length
          ? render(configuration.blocks)
          : 'This configuration has no blocks.'}
        {actionError && <ErrorMessage>{actionError}</ErrorMessage>}
      </Box>
    </UiKitContext.Provider>
  );
};

export const GeneratedUiContent = ({
  configuration,
  placement,
  roomId,
  messageId,
  onAction,
}) => {
  const validation = useMemo(
    () => validateGeneratedUiConfiguration(configuration),
    [configuration]
  );
  if (!validation.valid)
    return <ErrorMessage>{validation.errors.join(' ')}</ErrorMessage>;
  // Reset the entire form (including UI-kit child hooks) only for a different
  // component/content/context, never because the host recreated an equal object.
  const sessionKey = JSON.stringify([
    configuration.id,
    configuration.surface,
    configuration.blocks,
    placement,
    roomId,
    messageId,
  ]);
  return (
    <RenderErrorBoundary key={sessionKey}>
      <GeneratedUiSession
        {...{ configuration, placement, roomId, messageId, onAction }}
      />
    </RenderErrorBoundary>
  );
};

const focusable =
  'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]';

export const GeneratedUiSurface = ({
  open,
  onClose,
  configuration,
  anchorRef,
  dialogId,
  ...contentProps
}) => {
  const { theme } = useTheme();
  const [dialog, setDialog] = useState(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const [position, setPosition] = useState(null);
  const isModal = configuration?.surface === 'modal';

  useLayoutEffect(() => {
    if (!open || isModal || !dialog) return undefined;
    const updatePosition = () => {
      const anchor = anchorRef?.current?.getBoundingClientRect();
      const rect = dialog.getBoundingClientRect();
      if (!rect) return;
      const margin = 16;
      const right = anchor?.right ?? window.innerWidth - margin;
      const above =
        (anchor?.top ?? window.innerHeight - margin) - rect.height - 8;
      const preferredTop =
        above >= margin ? above : (anchor?.bottom ?? margin) + 8;
      setPosition({
        left: Math.max(
          margin,
          Math.min(right - rect.width, window.innerWidth - rect.width - margin)
        ),
        top: Math.max(
          margin,
          Math.min(preferredTop, window.innerHeight - rect.height - margin)
        ),
      });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    const observer =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(updatePosition)
        : null;
    observer?.observe(dialog);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      observer?.disconnect();
    };
  }, [open, isModal, anchorRef, dialog]);

  useEffect(() => {
    if (!open || !dialog) return undefined;
    const opener = document.activeElement;
    let restoreFocus = true;
    (dialog?.querySelector(focusable) || dialog)?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      } else if (isModal && event.key === 'Tab' && dialog) {
        const items = [...dialog.querySelectorAll(focusable)];
        const first = items[0] || dialog;
        const last = items[items.length - 1] || dialog;
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog)
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || document.activeElement === dialog)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const onOutside = (event) => {
      if (
        !dialog?.contains(event.target) &&
        !anchorRef?.current?.contains(event.target)
      ) {
        if (isModal && event.type === 'focusin') return;
        restoreFocus = event.type !== 'focusin' && isModal;
        closeRef.current();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onOutside, true);
    document.addEventListener('focusin', onOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('pointerdown', onOutside, true);
      document.removeEventListener('focusin', onOutside);
      if (restoreFocus && opener?.isConnected) opener.focus();
    };
  }, [open, isModal, anchorRef, dialog]);

  if (!open) return null;
  const content = (
    <GeneratedUiContent configuration={configuration} {...contentProps} />
  );
  const title = configuration?.title || 'Generated UI';
  if (isModal)
    return (
      <Modal
        ref={setDialog}
        id={dialogId}
        tabIndex={-1}
        onClose={onClose}
        aria-label={title}
        aria-modal="true"
        style={{
          width: 'fit-content',
          maxWidth: 'min(28rem, calc(100vw - 2rem))',
          maxHeight: 'calc(100dvh - 2rem)',
          overflow: 'auto',
        }}
      >
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
          <Modal.Close onClick={onClose} />
        </Modal.Header>
        <Modal.Content>{content}</Modal.Content>
      </Modal>
    );
  return createPortal(
    <Box
      ref={setDialog}
      id={dialogId}
      role="dialog"
      tabIndex={-1}
      aria-label={title}
      style={{ ...position, visibility: position ? 'visible' : 'hidden' }}
      css={css`
        position: fixed;
        z-index: 1200;
        width: fit-content;
        max-width: min(28rem, calc(100vw - 2rem));
        max-height: min(32rem, calc(100dvh - 2rem));
        overflow: auto;
        overflow-wrap: anywhere;
        padding: 1rem;
        border-radius: ${theme.radius};
        background: ${theme.colors.background};
        color: ${theme.colors.foreground};
        box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.2);
      `}
    >
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '0.75rem',
          fontWeight: 700,
        }}
      >
        <span>{title}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${title}`}
          css={css`
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 2.75rem;
            min-height: 2.75rem;
            flex-shrink: 0;
            border: 0;
            border-radius: ${theme.radius};
            background: transparent;
            color: inherit;
            cursor: pointer;
            &:hover {
              background: ${theme.colors.secondary};
            }
            &:focus-visible {
              outline: 2px solid currentColor;
              outline-offset: 2px;
            }
          `}
        >
          <Icon name="cross" size="1rem" />
        </button>
      </Box>
      {content}
    </Box>,
    document.body
  );
};
