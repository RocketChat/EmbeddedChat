import React, { useState } from 'react';
import { css } from '@emotion/react';
import { GenericModal } from '../GenericModal';
import { loginModalStore } from '../../store';
import { unAuthStore } from '../../store';
import { useRCAuth } from '../../hooks/useRCAuth';
import { Button } from '../Button';
import { Box } from '../Box';
import { Input } from '../Input';
import EyeOpen from './icons/EyeOpen';
import EyeClose from './icons/EyeClose';
import UserNotFound from './icons/UserNotFound';

export default function LoginForm() {
  const [userOrEmail, setuserOrEmail] = useState(null);
  const [password, setpassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const isLoginModalOpen = loginModalStore((state) => state.isLoginModalOpen);
  const setIsLoginModalOpen = loginModalStore(
    (state) => state.setIsLoginModalOpen
  );
  const isUnauthorizedAttempt = unAuthStore((state)=>state.isUnauthorizedAttempt);
  const setIsUnauthorizedAttempt = unAuthStore((state)=>state.setIsUnauthorizedAttempt);
  const { handleLogin } = useRCAuth();

  const handleSubmit = () => {
    handleLogin(userOrEmail, password);
  };
  const handleClose = () => {
    setIsLoginModalOpen(false);
    setIsUnauthorizedAttempt(false);
  };

  const handleEdituserOrEmail = (e) => {
    setuserOrEmail(e.target.value);
  };
  const handleEditPassword = (e) => {
    setpassword(e.target.value);
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

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

  const callOutRow = css`
  display: flex;
  align-self:flex-start;
  padding:0.5rem;
  margin-top: 1rem;
  border: 1px solid #b02e2c;
  border-radius:0.3rem;
  width:100%;
  `


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
              />
            </Box>
          </Box>

          <Box css={fieldCSS}>
            <Box css={fieldLabel}>Password</Box>
            <Box css={fieldRow}>
              <Input
                type={showPassword ? 'text' : 'password'}
                onChange={handleEditPassword}
                onKeyPress={handleKeyPress}
              />
              <Box
                type="button"
                css={passwordEyeCss}
                onClick={handleTogglePassword}
              >
                {showPassword ? <EyeOpen /> : <EyeClose />}
              </Box>
            </Box>
          </Box>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isUnauthorizedAttempt && (
              <Box css={callOutRow}>
                <UserNotFound />
                <Box style={{ marginLeft: '0.5rem' }}>User not found or incorrect password</Box>
              </Box>
            )}

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
