import { PasswordInput, Box } from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { totpModalStore } from '../../store';
import { GenericModal } from '../GenericModal';

export default function TotpModal({ handleLogin }) {
  const [accessCode, setAccessCode] = useState(null);
  const isModalOpen = totpModalStore((state) => state.isModalOpen);
  const setIsModalOpen = totpModalStore((state) => state.setIsModalOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(accessCode);
    setAccessCode(undefined);
  };
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleEdit = (e) => {
    setAccessCode(e.target.value);
  };
  return isModalOpen ? (
    <>
      <GenericModal
        variant="info"
        confirmText="Submit"
        cancelText="Cancel"
        title="Enter TOTP"
        icon="key"
        onCancel={handleClose}
        onClose={handleClose}
        onConfirm={handleSubmit}
      >
        <Box margin="1px 100px">
          <PasswordInput
            w="300px"
            fontScale="h3"
            onChange={handleEdit}
            placeholder="123456"
          />
        </Box>
      </GenericModal>
    </>
  ) : null;
}

TotpModal.propTypes = {
  handleLogin: PropTypes.func,
};
