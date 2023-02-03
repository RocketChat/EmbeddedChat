import {
  PasswordInput,
  Box,
  InputBox,
  Button,
  Modal,
  Label,
  Form,
  Field,
  FieldGroup,
  TextInput,
} from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import { GenericModal } from '../GenericModal';
import { loginModalStore } from '../../store';
import { useRCAuth } from '../../hooks/useRCAuth';
import classes from './Login.css';

export default function LoginForm() {
  const [userOrEmail, setuserOrEmail] = useState(null);
  const [password, setpassword] = useState(null);
  const isLoginModalOpen = loginModalStore((state) => state.isLoginModalOpen);
  const setIsLoginModalOpen = loginModalStore(
    (state) => state.setIsLoginModalOpen
  );
  const { handleLogin } = useRCAuth(userOrEmail, password);

  const handleSubmit = () => {
    // console.log(`login ${userOrEmail} and ${password}`);
    setIsLoginModalOpen(false);
    console.log(`login modal from handle submit  ${isLoginModalOpen}`);
    handleLogin();
  };
  const handleClose = () => {
    setIsLoginModalOpen(false);
    console.log(`login modal from handle close  ${isLoginModalOpen}`);
  };

  const handleEdituserOrEmail = (e) => {
    setuserOrEmail(e.target.value);
  };
  const handleEditPassword = (e) => {
    setpassword(e.target.value);
  };

  return isLoginModalOpen ? (
    <>
      <GenericModal
        variant="info"
        title="Login"
        icon="key"
        onClose={handleClose}
      >
        <Form
        // onSubmit={ handle submit }
        >
          <FieldGroup>
            <Field>
              <Field.Label> emailOrUsername</Field.Label>
              <Field.Row>
                <TextInput
                  onChange={() => {
                    console.log('change input');
                  }}
                  placeholder="example@example.com"
                />
              </Field.Row>
            </Field>

            <Field>
              <Field.Label>password</Field.Label>
              <Field.Row>
                <PasswordInput
                  onChange={() => {
                    console.log('enter password here');
                  }}
                />
              </Field.Row>
            </Field>
          </FieldGroup>
        </Form>
      </GenericModal>
    </>
  ) : null;
}
