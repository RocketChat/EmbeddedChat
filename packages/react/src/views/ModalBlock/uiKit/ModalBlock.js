/* eslint-disable react/prop-types */
import { useUniqueId } from '@rocket.chat/fuselage-hooks';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Box, Button, Modal } from '@embeddedchat/ui-elements';
import { UiKitComponent, UiKitModal, modalParser } from '@embeddedchat/ui-kit';
import RCContext from '../../../context/RCInstance';

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
  const { RCInstance } = useContext(RCContext);
  const getHost = () => {
    const host = RCInstance.getHost();
    return host;
  };
  const id = `modal_id_${useUniqueId()}`;
  const ref = useRef();

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
  const previousFocus = useMemo(() => document.activeElement, []);
  useEffect(
    () => () => previousFocus && previousFocus.focus(),
    [previousFocus]
  );
  return (
    <Modal
      onClose={onClose}
      open
      id={id}
      ref={ref}
      style={{
        maxWidth: '600px',
        maxHeight: '80vh',
      }}
    >
      <Modal.Header>
        {view.showIcon && (
          <Modal.Thumb url={`${getHost()}/api/apps/${view.appId}/icon`} />
        )}
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
            type={view.close.style === 'danger' ? 'destructive' : 'secondary'}
            onClick={onCancel}
          >
            {modalParser.text(view.close.text)}
          </Button>
        )}
        {view.submit && (
          <Button
            type={view.submit?.style === 'danger' ? 'destructive' : 'primary'}
            onClick={onSubmit}
          >
            {modalParser.text(view.submit.text)}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalBlock;
