import {
  PasswordInput,
  Box,
  Button,
  Modal,
  Field,
  TextInput,
  Icon,
  Divider,
} from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import { GenericModal } from '../GenericModal';
import { loginModalStore } from '../../store';
import { useRCAuth } from '../../hooks/useRCAuth';
import { useRCAuth4Google } from '../../hooks/useRCAuth4Google';
// import classes from './Login.css';

export default function LoginForm() {
  const [userOrEmail, setuserOrEmail] = useState(null);
  const [password, setpassword] = useState(null);
  const isLoginModalOpen = loginModalStore((state) => state.isLoginModalOpen);
  const setIsLoginModalOpen = loginModalStore(
    (state) => state.setIsLoginModalOpen
  );
  const { handleLogin } = useRCAuth();

  const handleSubmit = () => {
    handleLogin(userOrEmail, password);
  };
  const handleClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleEdituserOrEmail = (e) => {
    setuserOrEmail(e.target.value);
  };
  const handleEditPassword = (e) => {
    setpassword(e.target.value);
  };
  const { handleGoogleLogin } = useRCAuth4Google();

  const handleGooglewithLogin = () => {
    setIsLoginModalOpen(false);
    handleGoogleLogin();
  };
  return isLoginModalOpen ? (
    <>
      <GenericModal
        variant="info"
        title="Login"
        icon="key"
        onClose={handleClose}
      >
        <Box>
          <Field>
            <Field.Label> Email or username</Field.Label>
            <Field.Row>
              <TextInput
                onChange={handleEdituserOrEmail}
                placeholder="example@example.com"
              />
            </Field.Row>
          </Field>

          <Field>
            <Field.Label>Password</Field.Label>
            <Field.Row>
              <PasswordInput onChange={handleEditPassword} />
            </Field.Row>
          </Field>
          <Box marginWidth="25px 70px 25px 70px">
            <Button primary onClick={handleSubmit}>
              Login
            </Button>
          </Box>

          <Modal.Footer alignItems="center">
            <Button secondary onClick={handleGooglewithLogin}>
              <Icon name="google" /> Login with Google
            </Button>
          </Modal.Footer>
        </Box>
      </GenericModal>
    </>
  ) : null;
}
