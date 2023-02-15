import { useContext } from 'react';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import RCContext from '../context/RCInstance';
import {
  useToastStore,
  useUserStore,
  totpModalStore,
  loginModalStore,
} from '../store';

export const useRCAuth = () => {
  const { RCInstance } = useContext(RCContext);
  const setIsModalOpen = totpModalStore((state) => state.setIsModalOpen);
  const setUserAvatarUrl = useUserStore((state) => state.setUserAvatarUrl);
  const setIsLoginModalOpen = loginModalStore(
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
  const toastPosition = useToastStore((state) => state.position);
  const dispatchToastMessage = useToastBarDispatch();

  const handleLogin = async (userOrEmail, password, code) => {
    try {
      const res = await RCInstance.login(userOrEmail, password, code);
      if (res.error === 'Unauthorized') {
        dispatchToastMessage({
          type: 'error',
          message:
            'Invalid username or password. Please check your credentials and try again',
          position: toastPosition,
        });
      } else {
        if (res.error === 'totp-required') {
          setPassword(password);
          setEmailorUser(userOrEmail);
          setIsLoginModalOpen(false);
          setIsModalOpen(true);
          dispatchToastMessage({
            type: 'info',
            message: 'Please Open your authentication app and enter the code.',
            position: toastPosition,
          });
        } else if (res.error === 'totp-invalid') {
          dispatchToastMessage({
            type: 'error',
            message: 'Invalid TOTP Time-based One-time Password.',
            position: toastPosition,
          });
        }

        if (res.status === 'success') {
          setIsLoginModalOpen(false);
          setUserAvatarUrl(res.me.avatarUrl);
          setAuthenticatedUserUsername(res.me.username);
          setIsUserAuthenticated(true);
          setIsModalOpen(false);
          setEmailorUser(null);
          setPassword(null);
          dispatchToastMessage({
            type: 'success',
            message: 'Successfully logged in',
            position: toastPosition,
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
