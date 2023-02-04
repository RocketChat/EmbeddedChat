import { PasswordInput, Box, Modal, Button } from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { totpModalStore } from '../../store';
import { GenericModal } from '../GenericModal';
import classes from './TwoFactorTotpModal.module.css';

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
        title="Enter TOTP"
        icon="key"
        onClose={handleClose}
      >
        <Box>
          <Box margin="1px 110px">
            <PasswordInput
              w="270px"
              fontScale="h3"
              onChange={handleEdit}
              placeholder="123456"
            />
          </Box>
          <Modal.Footer>
            <Box className={classes.Footer}>
              <Button secondary onClick={handleClose}>
                Cancel
              </Button>
              <Button primary onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Modal.Footer>
        </Box>
      </GenericModal>
    </>
  ) : null;
}

TotpModal.propTypes = {
  handleLogin: PropTypes.func,
};
