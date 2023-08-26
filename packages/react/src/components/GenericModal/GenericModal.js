import { Modal, ModalBackdrop } from '@rocket.chat/fuselage';
import React from 'react';
import PropTypes from 'prop-types';
import classes from './Generic.module.css';
import { Icon } from '../Icon';

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

const GenericModal = ({ variant = 'info', children, title, icon, onClose }) => (
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
    </Modal>
  </ModalBackdrop>
);

GenericModal.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  icon: PropTypes.any,
  onClose: PropTypes.func,
};

export default GenericModal;
