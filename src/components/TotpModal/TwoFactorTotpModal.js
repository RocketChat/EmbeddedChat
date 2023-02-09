import { PasswordInput, Box, Modal, Button } from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { totpModalStore, useUserStore } from '../../store';
import { GenericModal } from '../GenericModal';
import classes from './TwoFactorTotpModal.module.css';

export default function TotpModal({
  handleGoogleLogin,
  handleLogin,
  handleFacebookLogin,
  FACEBOOK_APP_SECRET,
  FACEBOOK_APP_ID,
}) {
  const [accessCode, setAccessCode] = useState(null);
  const isModalOpen = totpModalStore((state) => state.isModalOpen);
  const setIsModalOpen = totpModalStore((state) => state.setIsModalOpen);
  const password = useUserStore((state) => state.password);
  const emailoruser = useUserStore((state) => state.emailoruser);
  const facebookAccessToken = useUserStore(
    (state) => state.facebookAccessToken
  );
  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== null && emailoruser !== null) {
      handleLogin(emailoruser, password, accessCode);
    } else if (facebookAccessToken !== null) {
      console.log(facebookAccessToken);
      handleFacebookLogin(accessCode);
    } else {
      handleGoogleLogin(accessCode);
    }
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
  handleGoogleLogin: PropTypes.func,
  handleLogin: PropTypes.func,
  handleFacebookLogin: PropTypes.func,
  FACEBOOK_APP_SECRET: PropTypes.string,
  FACEBOOK_APP_ID: PropTypes.string,
};
