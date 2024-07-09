import React, { useState } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import {
  Box,
  GenericModal,
  Modal,
  Input,
  Button,
} from '@embeddedchat/ui-elements';
import { totpModalStore, useUserStore } from '../../store';

export default function TotpModal({ handleLogin }) {
  const [accessCode, setAccessCode] = useState(null);
  const isTotpModalOpen = totpModalStore((state) => state.isTotpModalOpen);
  const setIsTotpModalOpen = totpModalStore(
    (state) => state.setIsTotpModalOpen
  );
  const password = useUserStore((state) => state.password);
  const emailoruser = useUserStore((state) => state.emailoruser);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== null && emailoruser !== null) {
      handleLogin(emailoruser, password, accessCode);
    }
    setAccessCode(undefined);
  };
  const handleClose = () => {
    setIsTotpModalOpen(false);
  };

  const handleEdit = (e) => {
    setAccessCode(e.target.value);
  };
  return isTotpModalOpen ? (
    <>
      <GenericModal
        variant="info"
        title="Enter TOTP"
        icon="key"
        onClose={handleClose}
      >
        <Box>
          <Box
            css={css`
              display: flex;
              padding: 0.6rem 0.4rem;
            `}
          >
            <Input type="password" onChange={handleEdit} placeholder="123456" />
          </Box>
          <Modal.Footer>
            <Button type="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Box>
      </GenericModal>
    </>
  ) : null;
}

TotpModal.propTypes = {
  handleLogin: PropTypes.func,
};
