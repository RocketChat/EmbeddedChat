import React, { useState } from 'react';
import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import { totpModalStore, useUserStore } from '../../store';
import { GenericModal } from '../../components/GenericModal';
import { Button } from '../../components/Button';
import { Box } from '../../components/Box';
import { Modal } from '../../components/Modal';
import { Input } from '../../components/Input';

export default function TotpModal({ handleLogin }) {
  const [accessCode, setAccessCode] = useState(null);
  const isModalOpen = totpModalStore((state) => state.isModalOpen);
  const setIsModalOpen = totpModalStore((state) => state.setIsModalOpen);
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
