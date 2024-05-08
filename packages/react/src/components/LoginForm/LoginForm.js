import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { GenericModal } from '../GenericModal';
import { loginModalStore } from '../../store';
import { useRCAuth } from '../../hooks/useRCAuth';
import { Button } from '../Button';
import { Box } from '../Box';
import { Input } from '../Input';
import { Icon } from '../Icon';

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

  const fieldCSS = css`
    display: flex;
    flex-flow: column nowrap;
    align-items: stretch;
    flex-shrink: 0;
    width: 100%;
  `;

  const fieldLabel = css`
    flex: 1 1 0;
    align-self: flex-start;
    margin-top: 0.125rem;
    margin-bottom: 0.125rem;
    margin-block: 0.125rem;
    letter-spacing: 0rem;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25rem;
    color: #2f343d;
  `;

  const fieldRow = css`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.25rem;
    -webkit-margin-before: 0.25rem;
    margin-block-start: 0.25rem;
    margin-bottom: 0.125rem;
    -webkit-margin-after: 0.125rem;
    margin-block-end: 0.125rem;
  `;

  const passwordEyeCss = css`
    cursor: pointer;
    position: absolute;
    right: 1em;
  `;

  return isLoginModalOpen ? (
    <>
      <GenericModal
        variant="info"
        title="Login"
        icon="key"
        onClose={handleClose}
      >
        <Box>
          <Box css={fieldCSS}>
            <Box css={fieldLabel}> Email or username</Box>
            <Box css={fieldRow}>
              <Input
                type="text"
                onChange={handleEdituserOrEmail}
                placeholder="example@example.com"
                onKeyPress={handleKeyPress}
                style={{ borderColor: usernameError ? 'red' : '' }}
              />
            </Box>
            {usernameError && (
              <span style={{ color: 'red', fontSize: '13px' }}>
                This field is required
              </span>
            )}
          </Box>

          <Box css={fieldCSS}>
            <Box css={fieldLabel}>Password</Box>
            <Box css={fieldRow}>
              <Input
                type={showPassword ? 'text' : 'password'}
                onChange={handleEditPassword}
                onKeyPress={handleKeyPress}
                style={{ borderColor: passwordError ? 'red' : '' }}
              />
              <Box
                type="button"
                css={passwordEyeCss}
                onClick={handleTogglePassword}
              >
                <Icon name={iconName} size="1.25rem" />
              </Box>
            </Box>
            {passwordError && (
              <span style={{ color: 'red', fontSize: '13px' }}>
                This field is required
              </span>
            )}
          </Box>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              color="primary"
              onClick={handleSubmit}
              style={{
                margin: '10px',
              }}
            >
              Login
            </Button>
          </Box>
        </Box>
      </GenericModal>
    </>
  ) : null;
}
