import { Button, PasswordInput, Box, Tile, Flex } from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUserStore, useTotpStore } from '../../store';
import styles from './TwoFactorTotpModal.module.css';

export default function TotpModal({ handleLogin }) {
  const [accessCode, setAccessCode] = useState(null);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const isModalOpen = useTotpStore((state) => state.isModalOpen);
  const SetisModalOpen = useTotpStore((state) => state.SetisModalOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(accessCode);
    setAccessCode(undefined);
  };
  const handleClose = () => {
    SetisModalOpen(false);
  };

  const handleEdit = (e) => {
    setAccessCode(e.target.value);
  };
  return isModalOpen ? (
    <>
      <div className={styles.modalcontainer}>
        <Box
          zIndex="2"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="absolute"
          m="x30"
          width="x150"
          height="x120"
        >
          <Tile elevation="2" margin={25}>
            <form onSubmit={handleSubmit}>
              <Box>Enter TOTP</Box>
              <PasswordInput onChange={handleEdit} placeholder={123456} />
              <Flex.Container justifyContent="space-around">
                <Button onClick={handleSubmit} primary>
                  Submit
                </Button>
                <Button onClick={handleClose}>Close</Button>
              </Flex.Container>
            </form>
          </Tile>
        </Box>
      </div>
    </>
  ) : null;
}

TotpModal.propTypes = {
  handleLogin: PropTypes.func,
};
