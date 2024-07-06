import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon';
import { Modal } from '../Modal';

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
  <Modal onClose={onClose}>
    <Modal.Header>
      {renderIcon(icon, variant)}
      <Modal.Title>{title ?? 'Are_you_sure'}</Modal.Title>
      <Modal.Close title="Close" onClick={onClose} />
    </Modal.Header>
    <Modal.Content>{children}</Modal.Content>
  </Modal>
);

GenericModal.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  icon: PropTypes.any,
  onClose: PropTypes.func,
};

export default GenericModal;
