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
      if (res.error === 'Unauthorized' || res.error === 403) {
        dispatchToastMessage({
          type: 'error',
          message:
            'Invalid username or password. Please check your credentials and try again',
        });
      } else {
        if (res.error === 'totp-required') {
          setPassword(password);
          setEmailorUser(userOrEmail);
          setIsLoginModalOpen(false);
          setIsTotpModalOpen(true);
          dispatchToastMessage({
            type: 'info',
            message: 'Please Open your authentication app and enter the code.',
          });
        } else if (res.error === 'totp-invalid') {
          dispatchToastMessage({
            type: 'error',
            message: 'Invalid TOTP Time-based One-time Password.',
          });
        }

        if (res.status === 'success') {
          setIsLoginModalOpen(false);
          setUserAvatarUrl(res.me.avatarUrl);
          setAuthenticatedUserUsername(res.me.username);
          setIsUserAuthenticated(true);
          setIsTotpModalOpen(false);
          setEmailorUser(null);
          setPassword(null);
          dispatchToastMessage({
            type: 'success',
            message: 'Successfully logged in',
          });
        }
      }
    } catch (e) {
      console.error('A error occurred while setting up user', e);
    }
  };

  return {
    handleLogin,
  };
};
