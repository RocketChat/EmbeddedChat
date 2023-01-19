/* eslint-disable react/prop-types */
import { Modal, Button, PasswordInput } from '@rocket.chat/fuselage';
import React, { useState } from 'react';

const TwoFactorTotpModal = ({
  handleLogin,
  isModalOpen,
  setIsModalOpen,
  method,
}) => {
  const [accessCode, setAccessCode] = useState(null);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(accessCode);
    setAccessCode(undefined);
    handleModalToggle();
  };

  const handleEdit = (e) => {
    setAccessCode(e.target.value);
  };
  return (
    isModalOpen && (
      <Modal>
        <Modal.Header>
          <Modal.HeaderText>
            <Modal.Title>Two-factor Authentication via ${method}</Modal.Title>
          </Modal.HeaderText>
          <Modal.Close />
        </Modal.Header>
        <Modal.Content>
          Open your authentication app and enter the code.
        </Modal.Content>
        <Modal.Footer>
          <Modal.FooterControllers>
            <PasswordInput placeholder="123456" onChange={handleEdit} />
            <Button onClick={handleModalToggle}>Cancel</Button>
            <Button primary onClick={handleSubmit}>
              Submit
            </Button>
          </Modal.FooterControllers>
        </Modal.Footer>
      </Modal>
    )
  );
};

export default TwoFactorTotpModal;
