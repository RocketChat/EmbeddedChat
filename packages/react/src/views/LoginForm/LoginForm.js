import React, { useState, useRef } from 'react';
import { css } from '@emotion/react';
import {
  GenericModal,
  Box,
  Button,
  Input,
  Icon,
  useTheme,
} from '@embeddedchat/ui-elements';
import { useLoginStore } from '../../store';
import { useRCAuth } from '../../hooks/useRCAuth';
import styles from './LoginForm.styles';

export default function LoginForm() {
  const userRef = useRef(null);
  const passRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const isLoginModalOpen = useLoginStore((state) => state.isLoginModalOpen);
  const setIsLoginModalOpen = useLoginStore(
    (state) => state.setIsLoginModalOpen
  );
  const { handleLogin } = useRCAuth();

  const { theme } = useTheme();

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const userOrEmail = userRef.current?.value || '';
    const password = passRef.current?.value || '';

    let hasError = false;
    if (userOrEmail.trim() === '') {
      setUsernameError(true);
      hasError = true;
    } else {
      setUsernameError(false);
    }

    if (password.trim() === '') {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }

    if (!hasError) {
      handleLogin(userOrEmail, password);
    }
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
  };

  const handleEdituserOrEmail = () => {
    if (usernameError) setUsernameError(false);
  };
  const handleEditPassword = () => {
    if (passwordError) setPasswordError(false);
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };
  const iconName = showPassword ? 'eyeopen' : 'eyeclose';
  const fields = [
    {
      label: 'Email or username',
      ref: userRef,
      onChange: handleEdituserOrEmail,
      placeholder: 'example@example.com',
      error: usernameError,
    },
    {
      label: 'Password',
      ref: passRef,
      type: showPassword ? 'text' : 'password',
      onChange: handleEditPassword,
      error: passwordError,
      autoComplete: 'new-password',
    },
  ];

  return isLoginModalOpen ? (
    <>
      <GenericModal
        variant="info"
        title="Login"
        icon="key"
        onClose={handleClose}
      >
        <Box>
          {fields.map((field, index) => (
            <Box key={index} css={styles.fieldContainer}>
              <Box css={styles.fieldLabel}>{field.label}</Box>
              <Box css={styles.fieldRow}>
                <Input
                  type={field.type || 'text'}
                  ref={field.ref}
                  onChange={field.onChange}
                  placeholder={field.placeholder}
                  onKeyPress={handleKeyPress}
                  style={{
                    ...(field.error && {
                      borderColor: theme.colors.destructive,
                      outline: 'none',
                    }),
                  }}
                />
                {field.label === 'Password' && (
                  <Box
                    type="button"
                    css={styles.passwordEye}
                    onClick={handleTogglePassword}
                  >
                    <Icon name={iconName} size="1.25rem" />
                  </Box>
                )}
              </Box>
              {field.error && (
                <Box
                  is="span"
                  css={css`
                    color: ${theme.colors.destructive};
                    font-size: 13px;
                  `}
                >
                  This field is required
                </Box>
              )}
            </Box>
          ))}
          <Button
            type="primary"
            onClick={handleSubmit}
            css={css`
              margin: 10px 0;
            `}
          >
            Login
          </Button>
        </Box>
      </GenericModal>
    </>
  ) : null;
}
