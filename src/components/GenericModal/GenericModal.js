import { Button, Modal, Icon, ModalBackdrop, Box } from '@rocket.chat/fuselage';
import React from 'react';
import PropTypes from 'prop-types';
import classes from './Generic.module.css';

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
    return <Icon size="30px" color={variant} name={iconMap[variant]} />;
  }

  if (typeof icon === 'string') {
    return <Icon size="30px" color={variant} name={icon} />;
  }

  return icon;
};

const GenericModal = ({
  variant = 'info',
  children,
  cancelText,
  confirmText,
  title,
  icon,
  onCancel,
  onClose = onCancel,
  onConfirm,
  confirmDisabled,
}) => (
  <ModalBackdrop>
    <Modal>
      <Modal.Header>
        {renderIcon(icon, variant)}
        <Modal.Title>{title ?? 'Are_you_sure'}</Modal.Title>
        <Modal.Close
          className={classes.close}
          title="Close"
          onClick={onClose}
        />
      </Modal.Header>
      <Modal.Content>{children}</Modal.Content>
      <Modal.Footer justifyContent="space-between">
        <Box className={classes.ModalFooter}>
          {onCancel && (
            <Button secondary onClick={onCancel}>
              {cancelText ?? 'Cancel'}
            </Button>
          )}
          <Button primary onClick={onConfirm} disabled={confirmDisabled}>
            {confirmText ?? 'Ok'}
          </Button>
        </Box>
      </Modal.Footer>
    </Modal>
  </ModalBackdrop>
);

GenericModal.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.object.isRequired,
  cancelText: PropTypes.any,
  confirmText: PropTypes.any,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  icon: PropTypes.any,
  confirmDisabled: PropTypes.bool,
  onCancel: PropTypes.func,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
};

export default GenericModal;
