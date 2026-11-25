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
import { totpModalStore, useUserStore, useTotpCredentialsStore } from '../../store';

// SECURITY FIX (Issue #1263): TOTP modal now uses ephemeral credentials store
export default function TotpModal({ handleLogin }) {
  const [accessCode, setAccessCode] = useState(null);
  const isTotpModalOpen = totpModalStore((state) => state.isTotpModalOpen);
  const setIsTotpModalOpen = totpModalStore(
    (state) => state.setIsTotpModalOpen
  );
  // SECURITY FIX (Issue #1263): Retrieve credentials from ephemeral TOTP store
  const { tempEmailOrUser, tempPassword } = useTotpCredentialsStore();
  const clearTotpCredentials = useTotpCredentialsStore((state) => state.clearTotpCredentials);
  const emailoruser = useUserStore((state) => state.emailoruser);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (tempPassword && (tempEmailOrUser || emailoruser)) {
      handleLogin(tempEmailOrUser || emailoruser, tempPassword, accessCode);
    }
    setAccessCode(undefined);
  };
  
  const handleClose = () => {
    // SECURITY FIX (Issue #1263): Clear ephemeral credentials when modal closes
    clearTotpCredentials();
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
