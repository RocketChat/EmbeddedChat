import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
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

const closeStyles = css`
  cursor: pointer;
  padding: 12px 16px;

  &:hover {
    background: #bbb;
  }
`;

const modalFooterStyles = css`
  display: flex;
  justify-content: space-around;
`;

const GenericModal = ({ variant = 'info', children, title, icon, onClose }) => (
  <Modal>
    <Modal.Header>
      {renderIcon(icon, variant)}
      <Modal.Title>{title ?? 'Are_you_sure'}</Modal.Title>
      <Modal.Close css={closeStyles} title="Close" onClick={onClose} />
    </Modal.Header>
    <Modal.Content>{children}</Modal.Content>
    <div css={modalFooterStyles}>{/* Footer content */}</div>
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
