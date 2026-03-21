import { useContext } from 'react';
import { useToastBarDispatch } from '@embeddedchat/ui-elements';
import RCContext from '../context/RCInstance';
import { useUserStore, totpModalStore, useLoginStore } from '../store';

export const useRCAuth = () => {
  const { RCInstance } = useContext(RCContext);
  const setIsTotpModalOpen = totpModalStore(
    (state) => state.setIsTotpModalOpen
  );
  const setUserAvatarUrl = useUserStore((state) => state.setUserAvatarUrl);
  const setIsLoginModalOpen = useLoginStore(
    (state) => state.setIsLoginModalOpen
  );
  const setAuthenticatedUserUsername = useUserStore(
    (state) => state.setUsername
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );
  const setPassword = useUserStore((state) => state.setPassword);
  const setEmailorUser = useUserStore((state) => state.setEmailorUser);
  const dispatchToastMessage = useToastBarDispatch();

  const handleLogin = async (userOrEmail, password, code) => {
    try {
      const res = await RCInstance.login(userOrEmail, password, code);

      // Handle specific error codes or generic Unauthorized
      if (res.error === 'Unauthorized' || res.error === 403) {
        dispatchToastMessage({
          type: 'error',
          message: 'Invalid username or password. Please check your credentials.',
        });
        return { status: 'error', error: 'Unauthorized' };
      }

      // Handle Two-Factor Authentication (TOTP)
      if (res.error === 'totp-required') {
        setPassword(password);
        setEmailorUser(userOrEmail);
        setIsLoginModalOpen(false);
        setIsTotpModalOpen(true);
        dispatchToastMessage({
          type: 'info',
          message: 'MFA Required: Please enter the code from your authenticator app.',
        });
        return { status: 'totp-required' };
      }

      if (res.error === 'totp-invalid') {
        dispatchToastMessage({
          type: 'error',
          message: 'Invalid TOTP code. Please try again.',
        });
        return { status: 'error', error: 'totp-invalid' };
      }

      // Handle Successful Login
      if (res.status === 'success' || (res.me && !res.error)) {
        setIsLoginModalOpen(false);
        setUserAvatarUrl(res.me.avatarUrl);
        setAuthenticatedUserUsername(res.me.username);
        setIsUserAuthenticated(true);
        setIsTotpModalOpen(false);

        // Clear sensitive temporary data
        setEmailorUser(null);
        setPassword(null);

        dispatchToastMessage({
          type: 'success',
          message: `Welcome back, ${res.me.username}!`,
        });
        return { status: 'success', user: res.me };
      }

      // Catch-all for other response errors
      if (res.error) {
        throw new Error(res.reason || res.error);
      }
    } catch (e) {
      console.error('Login implementation error:', e);
      dispatchToastMessage({
        type: 'error',
        message: 'Authentication failed due to a network or server error.',
      });
      return { status: 'error', error: e.message };
    }
  };

  return {
    handleLogin,
  };
};
