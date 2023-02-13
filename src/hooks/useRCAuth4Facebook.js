import { useContext } from 'react';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';
import RCContext from '../context/RCInstance';
import { useToastStore, useUserStore, totpModalStore } from '../store';

export const useRCAuth4Facebook = () => {
  const { RCInstance } = useContext(RCContext);
  const setIsModalOpen = totpModalStore((state) => state.setIsModalOpen);
  const setUserAvatarUrl = useUserStore((state) => state.setUserAvatarUrl);
  const setAuthenticatedUserUsername = useUserStore(
    (state) => state.setUsername
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );
  const setfacebookAccessToken = useUserStore(
    (state) => state.setfacebookAccessToken
  );
  const facebookAccessToken = useUserStore(
    (state) => state.facebookAccessToken
  );
  const toastPosition = useToastStore((state) => state.position);
  const dispatchToastMessage = useToastBarDispatch();

  let FBAccessToken;
  const handleFacebookLogin = async (accessCode) => {
    window.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        setfacebookAccessToken(response.authResponse.accessToken);
        FBAccessToken = response.authResponse.accessToken;
      } else {
        window.FB.login(
          // eslint-disable-next-line no-shadow
          (response) => {
            if (response.authResponse) {
              FBAccessToken = response.authResponse.accessToken;
              setfacebookAccessToken(response.authResponse.accessToken);
            } else {
              dispatchToastMessage({
                type: 'error',
                message: 'cancelled login or did not fully authorize.',
                position: toastPosition,
              });
            }
          },
          { scope: 'public_profile,email' }
        );
      }
    });

    try {
      const res = await RCInstance.FacebookLogin(FBAccessToken, accessCode);

      if (res.error === 'totp-required') {
        setIsModalOpen(true);
        dispatchToastMessage({
          type: 'info',
          message: 'Please Open your authentication app and enter the code.',
          position: toastPosition,
        });
      } else if (res.error === 'totp-invalid') {
        dispatchToastMessage({
          type: 'error',
          message:
            'Something went wrong. Please check your TOTP and try again.',
          position: toastPosition,
        });
      } else if (res.status === 'error') {
        dispatchToastMessage({
          type: 'error',
          message: 'Something wrong happened',
          position: toastPosition,
        });
      }

      if (res.status === 'success') {
        setUserAvatarUrl(res.me.avatarUrl);
        setAuthenticatedUserUsername(res.me.username);
        setIsUserAuthenticated(true);
        setIsModalOpen(false);
        setfacebookAccessToken(null);
        dispatchToastMessage({
          type: 'success',
          message: 'Successfully logged in',
          position: toastPosition,
        });
      }
    } catch (e) {
      console.error('A error occurred while setting up user', e);
    }
  };

  return {
    handleFacebookLogin,
  };
};
