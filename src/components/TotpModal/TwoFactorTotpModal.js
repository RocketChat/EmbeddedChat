import { Button, PasswordInput, Box, Tile, Flex } from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { totpModalStore } from '../../store';
import styles from './TwoFactorTotpModal.module.css';

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
      <Box className={styles.modalcontainer}>
        <Tile elevation="2" margin={25}>
          <form onSubmit={handleSubmit}>
            <Box>Enter TOTP</Box>
            <PasswordInput
              w="125px"
              fontScale="h4"
              onChange={handleEdit}
              placeholder="123456"
            />
            <Box className={styles.actionButton}>
              <Button margin="5px 1px 1px" onClick={handleSubmit} primary>
                Submit
              </Button>
              <Button margin="5px 1px 1px 10px" onClick={handleClose}>
                Close
              </Button>
            </Box>
          </form>
        </Tile>
      </Box>
    </>
  ) : null;
}

TotpModal.propTypes = {
  handleLogin: PropTypes.func,
};
