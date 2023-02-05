import {
  PasswordInput,
  Box,
  Button,
  Modal,
  Field,
  TextInput,
  Icon,
} from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import { GenericModal } from '../GenericModal';
import { loginModalStore } from '../../store';
import { useRCAuth } from '../../hooks/useRCAuth';
import { useRCAuth4Google } from '../../hooks/useRCAuth4Google';
import classes from './Login.module.css';

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
          <Modal.Footer alignItems="center">
            <Box className={classes.Footer}>
              <Button
                primary
                onClick={handleSubmit}
                margin="10px 10px 10px 10px"
              >
                Login
              </Button>
              <Box className={classes.Seperator}>
                <hr className={classes.darkLine} />
                OR
                <hr className={classes.darkLine} />
              </Box>
              <Button
                secondary
                onClick={handleGooglewithLogin}
                margin="10px 10px 10px 10px"
              >
                <Icon name="google" /> Login with Google
              </Button>
            </Box>
          </Modal.Footer>
        </Box>
      </GenericModal>
    </>
  ) : null;
}
