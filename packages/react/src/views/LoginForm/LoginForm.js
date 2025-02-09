import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import {
  Modal,
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
  const [userOrEmail, setUserOrEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const isLoginModalOpen = useLoginStore((state) => state.isLoginModalOpen);
  const setIsLoginModalOpen = useLoginStore(
    (state) => state.setIsLoginModalOpen
  );
  const { handleLogin } = useRCAuth();

  const { theme } = useTheme();

  useEffect(() => {
    if (userOrEmail !== null && userOrEmail.trim() === '') {
      setUsernameError(true);
    } else {
      setUsernameError(false);
    }

    if (password !== null && password.trim() === '') {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }, [userOrEmail, password]);

  const handleSubmit = () => {
    if (!userOrEmail) setUserOrEmail('');
    if (!password) setPassword('');
    handleLogin(userOrEmail, password);
  };
  const handleClose = () => {
    setUserOrEmail(null);
    setPassword(null);
    setIsLoginModalOpen(false);
  };

  const handleEdituserOrEmail = (e) => {
    setUserOrEmail(e.target.value);
  };
  const handleEditPassword = (e) => {
    setPassword(e.target.value);
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
      onChange: handleEdituserOrEmail,
      placeholder: 'example@example.com',
      error: usernameError,
    },
    {
      label: 'Password',
      type: showPassword ? 'text' : 'password',
      onChange: handleEditPassword,
      error: passwordError,
    },
  ];

  return isLoginModalOpen ? (
    <>
      <Modal variant="info" onClose={handleClose} css={styles.modal}>
        <Modal.Header>
          <Modal.Title css={styles.modalTitle}>
            <Icon
              name="key"
              size="1.25rem"
              css={css`
                margin-right: 0.5rem;
              `}
            />{' '}
            Login
          </Modal.Title>
          <Modal.Close onClick={handleClose} />
        </Modal.Header>
        <Modal.Content>
          <Box>
            {fields.map((field, index) => (
              <Box key={index} css={styles.fieldContainer}>
                <Box css={styles.fieldLabel}>{field.label}</Box>
                <Box css={styles.fieldRow}>
                  <Input
                    type={field.type || 'text'}
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
          </Box>
        </Modal.Content>
        <Modal.Footer>
          <Button
            type="primary"
            onClick={handleSubmit}
            css={css`
              margin: 10px 0;
            `}
          >
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  ) : null;
}
