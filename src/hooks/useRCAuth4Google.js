import { useState, useContext } from 'react';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import RCContext from '../context/RCInstance';
import { useGoogleLogin } from './useGoogleLogin';
import { useToastStore, useUserStore } from '../store';

export const useRCAuth4Google = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userOrEmail, setUserOrEmail] = useState(null);
  const [method, setMethod] = useState(undefined);

  const { signIn, signOut } = useGoogleLogin(
    process.env.REACT_APP_GOOGLE_CLIENT_ID
  );

  const { RCInstance } = useContext(RCContext);

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
      if (res.error === 'totp-required') {
        setUserOrEmail(res.details.emailOrUsername);
        setIsModalOpen(true);
        if (res.details.availableMethods.length > 1) {
          setMethod('totp');
        } else {
          setMethod(res.details.availableMethods[0]);
        }
      }
      if (res.status === 'success') {
        setUserAvatarUrl(res.me.avatarUrl);
        setAuthenticatedUserUsername(res.me.username);
        setIsUserAuthenticated(true);
        dispatchToastMessage({
          type: 'success',
          message: 'Successfully logged in',
          position: toastPosition,
        });
      } else {
        dispatchToastMessage({
          type: 'error',
          message: 'Something wrong happened',
          position: toastPosition,
        });
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

  const handleResend = async () => {
    const res = await RCInstance.resend2FA(userOrEmail);
    return res;
  };

  return {
    handleLogin,
    handleLogout,
    handleResend,
    isModalOpen,
    setIsModalOpen,
    method,
    userOrEmail,
  };
};
