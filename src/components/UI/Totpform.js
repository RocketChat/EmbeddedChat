import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Box } from '@rocket.chat/fuselage';

import { useRCAuth4Google } from '../../hooks/useRCAuth4Google';

// const {
//   handleLogin,
//   handleLogout,
//   handleResend,
//   isModalOpen,
//   setIsModalOpen,
//   method,
//   userOrEmail,
// } = useRCAuth4Google();

// const [accessCode, setAccessCode] = useState(null);
// const handleModalToggle = () => {
//   setIsModalOpen(!isModalOpen);
// };

// const handleSubmit = (e) => {
//   e.preventDefault();
//   setAccessCode(undefined);
//   handleLogin(accessCode);
//   handleModalToggle();
// };

// const handleEdit = (e) => {
//   setAccessCode(e.target.value);
// };

const TotpForm = () => (
  <Modal>
    <Modal.Header>
      <Modal.HeaderText>
        <Modal.Title>Modal Header</Modal.Title>
      </Modal.HeaderText>
      <Modal.Close />
    </Modal.Header>
    <Modal.Content>Modal Body</Modal.Content>
    <Modal.Footer>
      <Modal.FooterControllers>
        <Button>Cancel</Button>
        <Button primary onClick={console.log('click')}>
          Submit
        </Button>
      </Modal.FooterControllers>
    </Modal.Footer>
  </Modal>
);

export default TotpForm;

// https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_modal
