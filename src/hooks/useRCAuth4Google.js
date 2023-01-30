import { useState, useContext } from 'react';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import RCContext from '../context/RCInstance';
import { useGoogleLogin } from './useGoogleLogin';
import { useToastStore, useUserStore, useTotpStore } from '../store';

export const useRCAuth4Google = () => {
  const [userOrEmail, setUserOrEmail] = useState(null);

  const { signIn, signOut } = useGoogleLogin(
    process.env.REACT_APP_GOOGLE_CLIENT_ID
  );

  const { RCInstance } = useContext(RCContext);

  const SetisModalOpen = useTotpStore((state) => state.SetisModalOpen);
  const setUserAvatarUrl = useUserStore((state) => state.setUserAvatarUrl);
  const setAuthenticatedUserUsername = useUserStore(
    (state) => state.setUsername
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );
  const toastPosition = useToastStore((state) => state.position);
  const dispatchToastMessage = useToastBarDispatch();

  const handleLogin = async (acsCode) => {
    try {
      const res = await RCInstance.googleSSOLogin(signIn, acsCode);

      if (res === undefined) {
        dispatchToastMessage({
          type: 'error',
          message:
            'Something went wrong. Please check your TOTP and try again.',
          position: toastPosition,
        });
      } else {
        if (res.error === 'totp-required') {
          setUserOrEmail(res.details.emailOrUsername);
          SetisModalOpen(true);
          dispatchToastMessage({
            type: 'info',
            message: 'Please Open your authentication app and enter the code.',
            position: toastPosition,
          });
        }

        if (res.status === 'success') {
          setUserAvatarUrl(res.me.avatarUrl);
          setAuthenticatedUserUsername(res.me.username);
          setIsUserAuthenticated(true);
          SetisModalOpen(false);
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

  const handleLogout = async () => {
    const res = await RCInstance.logout();
    if (res.status === 'success') {
      setIsUserAuthenticated(false);
      setUserAvatarUrl('');
      dispatchToastMessage({
        type: 'success',
        message: 'Successfully logged out',
        position: toastPosition,
      });
    }
  };

  return {
    handleLogin,
    handleLogout,
    userOrEmail,
  };
};
