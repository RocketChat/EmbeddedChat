import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { totpModalStore, useUserStore } from '../../store';
import { GenericModal } from '../GenericModal';
import { Button } from '../Button';
import { Box } from '../Box';
import { Modal } from '../Modal';
import { Input } from '../Input';

const Footer = css`
  display: flex;
  justify-content: space-around;
`;

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
          <Box style={{ margin: '1px 110px' }}>
            <Input
              style={{ width: '270px' }}
              type="password"
              onChange={handleEdit}
              placeholder="123456"
            />
          </Box>
          <Modal.Footer>
            <Box css={Footer}>
              <Button color="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button color="primary" onClick={handleSubmit}>
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
