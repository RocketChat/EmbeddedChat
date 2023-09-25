/* eslint-disable react/prop-types */
import { useUniqueId } from '@rocket.chat/fuselage-hooks';
import React, { useEffect, useMemo, useRef } from 'react';
import { UiKitComponent, UiKitModal, modalParser } from '..';
import { Box } from '../../Box';
import { Button } from '../../Button';
import { Modal } from '../../Modal';

const getButtonStyle = (view) =>
  view.submit?.style === 'danger' ? { danger: true } : { primary: true };
const focusableElementsString = `
	a[href]:not([tabindex="-1"]),
	area[href]:not([tabindex="-1"]),
	input:not([disabled]):not([tabindex="-1"]),
	select:not([disabled]):not([tabindex="-1"]),
	textarea:not([disabled]):not([tabindex="-1"]),
	button:not([disabled]):not([tabindex="-1"]),
	iframe,
	object,
	embed,
	[tabindex]:not([tabindex="-1"]),
	[contenteditable]`;

const focusableElementsStringInvalid = `
	a[href]:not([tabindex="-1"]):invalid,
	area[href]:not([tabindex="-1"]):invalid,
	input:not([disabled]):not([tabindex="-1"]):invalid,
	select:not([disabled]):not([tabindex="-1"]):invalid,
	textarea:not([disabled]):not([tabindex="-1"]):invalid,
	button:not([disabled]):not([tabindex="-1"]):invalid,
	iframe:invalid,
	object:invalid,
	embed:invalid,
	[tabindex]:not([tabindex="-1"]):invalid,
	[contenteditable]:invalid`;

function ModalBlock({ view, errors, onSubmit, onClose, onCancel }) {
  const id = `modal_id_${useUniqueId()}`;
  const ref = useRef();

  // Auto focus
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (errors && Object.keys(errors).length) {
      const element = ref.current.querySelector(focusableElementsStringInvalid);
      element && element.focus();
    } else {
      const element = ref.current.querySelector(focusableElementsString);
      element && element.focus();
    }
  }, [errors]);
  // save focus to restore after close
  const previousFocus = useMemo(() => document.activeElement, []);
  // restore the focus after the component unmount
  useEffect(
    () => () => previousFocus && previousFocus.focus(),
    [previousFocus]
  );
  return (
    <Modal
      open
      id={id}
      ref={ref}
      style={{
        maxWidth: '600px',
        maxHeight: '80vh',
      }}
    >
      <Modal.Header>
        <Modal.Title>{modalParser.text(view.title)}</Modal.Title>
        <Modal.Close tabIndex={-1} onClick={onClose} />
      </Modal.Header>
      <Modal.Content>
        <Box style={{ padding: '0.25rem' }}>
          <form method="post" action="#" onSubmit={onSubmit}>
            <UiKitComponent render={UiKitModal} blocks={view.blocks} />
          </form>
        </Box>
      </Modal.Content>
      <Modal.Footer>
        {view.close && (
          <Button
            color={view.close.style === 'danger' ? 'error' : 'secondary'}
            onClick={onCancel}
          >
            {modalParser.text(view.close.text)}
          </Button>
        )}
        {view.submit && (
          <Button {...getButtonStyle(view)} onClick={onSubmit} color="primary">
            {modalParser.text(view.submit.text)}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalBlock;
export { modalParser };
