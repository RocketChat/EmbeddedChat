import React, { useEffect, useState } from 'react';
import { css, useTheme } from '@emotion/react';
import { GenericModal } from '../../components/GenericModal';
import { loginModalStore, useUserStore } from '../../store';
import { useRCAuth } from '../../hooks/useRCAuth';
import { Button } from '../../components/Button';
import { Box } from '../../components/Box';
import { Input } from '../../components/Input';
import { Icon } from '../../components/Icon';
import styles from './LoginForm.styles';

export default function LoginForm() {
  const [userOrEmail, setUserOrEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const isLoginModalOpen = loginModalStore((state) => state.isLoginModalOpen);
  const setIsLoginModalOpen = loginModalStore(
    (state) => state.setIsLoginModalOpen
  );
  const { handleLogin } = useRCAuth();
  const theme = useTheme();
  const dark = useUserStore((state) => state.dark);
  const mode = dark ? 'dark' : 'light';
  const errorColor = theme.schemes[mode].destructive;

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

  return isLoginModalOpen ? (
    <>
      <GenericModal
        variant="info"
        title="Login"
        icon="key"
        onClose={handleClose}
      >
        <Box>
          <Box css={styles.fieldContainer}>
            <Box css={styles.fieldLabel}> Email or username</Box>
            <Box css={styles.fieldRow}>
              <Input
                type="text"
                onChange={handleEdituserOrEmail}
                placeholder="example@example.com"
                onKeyPress={handleKeyPress}
                style={{
                  borderColor: usernameError ? errorColor : '',
                }}
              />
            </Box>
            {usernameError && (
              <Box is="span" style={{ color: errorColor, fontSize: '13px' }}>
                This field is required
              </Box>
            )}
          </Box>

          <Box css={styles.fieldContainer}>
            <Box css={styles.fieldLabel}>Password</Box>
            <Box css={styles.fieldRow}>
              <Input
                type={showPassword ? 'text' : 'password'}
                onChange={handleEditPassword}
                onKeyPress={handleKeyPress}
                style={{ borderColor: passwordError ? errorColor : '' }}
              />
              <Box
                type="button"
                css={styles.passwordEye}
                onClick={handleTogglePassword}
              >
                <Icon name={iconName} size="1.25rem" />
              </Box>
            </Box>
            {passwordError && (
              <Box
                is="span"
                css={css`
                  color: ${errorColor};
                  font-size: 13px;
                `}
              >
                This field is required
              </Box>
            )}
          </Box>
          <Box>
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
        </Box>
      </GenericModal>
    </>
  ) : null;
}
