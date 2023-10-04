import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react'; // Step 1: Import `css` from Emotion.sh
import { Icon } from '../Icon';
import { Modal } from '../Modal';

const iconMap = {
  danger: 'modal-warning',
  warning: 'modal-warning',
  info: 'info',
  success: 'check',
};

// Define Emotion.sh styles for your component
const modalStyles = {
  modalHeader: css`
    display: flex;
    justify-content: space-between;
  `,
  closeButton: css`
    cursor: pointer;
    padding: 12px 16px;

    &:hover {
      background: #bbb;
    }
  `,
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
  <Modal>
    <Modal.Header>
      {renderIcon(icon, variant)}
      <Modal.Title>{title ?? 'Are_you_sure'}</Modal.Title>
      {/* Apply Emotion.sh styles using the css prop */}
      <Modal.Close css={modalStyles.closeButton} title="Close" onClick={onClose} />
    </Modal.Header>
    <Modal.Content>{children}</Modal.Content>
  </Modal>
);

GenericModal.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.node.isRequired, // Use `node` instead of `object` for children
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  icon: PropTypes.any,
  onClose: PropTypes.func,
};

export default GenericModal;
