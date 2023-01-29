import { Button, Modal } from '@rocket.chat/fuselage';
import React from 'react';

const iconMap = {
  danger: 'modal-warning',
  warning: 'modal-warning',
  info: 'info',
  success: 'check',
};

const renderIcon = (icon, variant) => {
  if (icon === null) {
    return null;
  }

  if (icon === undefined) {
    return <Modal.Icon color={variant} name={iconMap[variant]} />;
  }

  if (typeof icon === 'string') {
    return <Modal.Icon name={icon} />;
  }

  return icon;
};

const GenericModal = (
  children,
  cancelText,
  confirmText,
  title,
  icon,
  onCancel,
  onClose,
  onConfirm,
  confirmDisabled,
  variant,
  dontAskAgain
) => {
  if (!onClose) {
    onClose = onCancel;
  }
  return (
    <Modal>
      <Modal.Header>
        {/* {renderIcon(icon, variant)}
        <Modal.HeaderText>
          <Modal.Title>{title ?? 'Are_you_sure'}</Modal.Title>
        </Modal.HeaderText>
        <Modal.Close title="Close" onClick={onClose} /> */}
        Header Element
      </Modal.Header>
      <Modal.Content>Content Element</Modal.Content>
      {/* <Modal.Footer justifyContent={dontAskAgain ? 'space-between' : 'end'}>
        <Modal.FooterControllers>
          {onCancel && (
            <Button secondary onClick={onCancel}>
              {cancelText ?? 'Cancel'}
            </Button>
          )}
          <Button onClick={onConfirm} disabled={confirmDisabled}>
            {confirmText ?? 'Ok'}
          </Button>
        </Modal.FooterControllers>
      </Modal.Footer> */}
      <Modal.Footer>Footer Element</Modal.Footer>
    </Modal>
  );
};

export default GenericModal;
