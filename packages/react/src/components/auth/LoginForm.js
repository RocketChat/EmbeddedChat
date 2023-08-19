import React, { useState } from 'react';
import { css } from '@emotion/react';
import { GenericModal } from '../GenericModal';
import { loginModalStore } from '../../store';
import { useRCAuth } from '../../hooks/useRCAuth';
import { useRCAuth4Google } from '../../hooks/useRCAuth4Google';
import { Button } from '../Button';
import { Box } from '../Box';
import { Input } from '../Input';
import { Icon } from '../Icon';

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
  const separatorCss = css`
    width: 45%;
    background-color: rgb(131, 131, 131);
    height: 1px;
    border: none;
  `;
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
              />
            </Box>
          </Box>

          <Box css={fieldCSS}>
            <Box css={fieldLabel}>Password</Box>
            <Box css={fieldRow}>
              <Input type="password" onChange={handleEditPassword} />
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
            <Button
              color="primary"
              onClick={handleSubmit}
              style={{
                margin: '10px',
              }}
            >
              Login
            </Button>
            <Box
              css={css`
                display: flex;
                width: 100%;
                flex-direction: row;
              `}
            >
              <hr css={separatorCss} />
              <span>OR</span>
              <hr css={separatorCss} />
            </Box>
            <Button
              color="secondary"
              onClick={handleGooglewithLogin}
              style={{ margin: '10px' }}
            >
              <Icon name="google" /> Login with Google
            </Button>
          </Box>
        </Box>
      </GenericModal>
    </>
  ) : null;
}
