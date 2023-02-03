import { useContext } from 'react';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import RCContext from '../context/RCInstance';
import {
  useToastStore,
  useUserStore,
  totpModalStore,
  loginModalStore,
} from '../store';

export const useRCAuth = (userOrEmail, password) => {
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
  const toastPosition = useToastStore((state) => state.position);
  const dispatchToastMessage = useToastBarDispatch();

  const handleLogin = async () => {
    try {
      const res = await RCInstance.login(userOrEmail, password);
      console.log(res);
      if (res === undefined) {
        dispatchToastMessage({
          type: 'error',
          message:
            'Something went wrong. Please check your TOTP and try again.',
          position: toastPosition,
        });
      } else {
        if (res.error === 'totp-required') {
          setIsLoginModalOpen(false);
          dispatchToastMessage({
            type: 'info',
            message: 'Please Open your authentication app and enter the code.',
            position: toastPosition,
          });
        }
        if (res.status === 'success') {
          setIsLoginModalOpen(false);
          setUserAvatarUrl(res.me.avatarUrl);
          setAuthenticatedUserUsername(res.me.username);
          setIsUserAuthenticated(true);
          setIsModalOpen(false);
          dispatchToastMessage({
            type: 'success',
            message: 'Successfully logged in',
            position: toastPosition,
          });
        } else if (res.status === 'error' && !(res.error === 'totp-required')) {
          dispatchToastMessage({
            type: 'error',
            message: 'Something wrong happened',
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
