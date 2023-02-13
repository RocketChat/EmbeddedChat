import { Box } from '@rocket.chat/fuselage';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ToastBarProvider } from '@rocket.chat/fuselage-toastbar';
import Cookies from 'js-cookie';
import { ChatBody, ChatHeader, ChatInput, Home } from './components';
import RocketChatInstance from './lib/api';
import { RCInstanceProvider } from './context/RCInstance';
import { useToastStore, useUserStore } from './store';
import { RC_USER_ID_COOKIE, RC_USER_TOKEN_COOKIE } from './lib/constant';

export const RCComponent = ({
  isClosable = false,
  setClosableState,
  moreOpts = false,
  width = '100%',
  height = '30vh',
  GOOGLE_CLIENT_ID,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  host = 'http://localhost:3000',
  roomId = 'GENERAL',
  channelName,
  anonymousMode = false,
  headerColor = '#fff',
  toastBarPosition = 'bottom-end',
  showRoles = false,
  showAvatar = false,
}) => {
  const [fullScreen, setFullScreen] = useState(false);
  const setToastbarPosition = useToastStore((state) => state.setPosition);
  const setShowAvatar = useUserStore((state) => state.setShowAvatar);

  useEffect(() => {
    setToastbarPosition(toastBarPosition);
    setShowAvatar(showAvatar);
  }, []);

  if (isClosable && !setClosableState) {
    throw Error(
      'Please provide a setClosableState to props when isClosable = true'
    );
  }

  const RCInstance = new RocketChatInstance(host, roomId, FACEBOOK_APP_SECRET);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  useEffect(() => {
    const cookiesPresent =
      Cookies.get(RC_USER_TOKEN_COOKIE) && Cookies.get(RC_USER_ID_COOKIE);
    if (cookiesPresent) {
      setIsUserAuthenticated(true);
    }
  }, []);

  const authenticatedUserUsername = useUserStore((state) => state.username);
  const authenticatedUserAvatarUrl = useUserStore((state) => state.avatarUrl);
  const authenticatedUserId = useUserStore((state) => state.userId);

  const setAuthenticatedUserUsername = useUserStore(
    (state) => state.setUsername
  );
  const setAuthenticatedUserAvatarUrl = useUserStore(
    (state) => state.setUserAvatarUrl
  );
  const setAuthenticatedUserId = useUserStore((state) => state.setUserId);

  useEffect(() => {
    async function getUserEssentials() {
      const res = await RCInstance.me();
      setAuthenticatedUserAvatarUrl(res.avatarUrl);
      setAuthenticatedUserUsername(res.username);
      setAuthenticatedUserId(res.userId);
    }

    const cookiesPresent =
      Cookies.get(RC_USER_TOKEN_COOKIE) && Cookies.get(RC_USER_ID_COOKIE);
    if (cookiesPresent) {
      setIsUserAuthenticated(true);
    }

    const currentUserId = Cookies.get(RC_USER_ID_COOKIE);
    if (
      !authenticatedUserUsername ||
      !authenticatedUserAvatarUrl ||
      authenticatedUserId !== currentUserId
    ) {
      getUserEssentials();
    }
  }, []);

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: `${FACEBOOK_APP_ID}`,
        cookie: true,
        xfbml: true,
        version: 'v9.0',
      });
    };

    (function (d, s, id) {
      let js;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      // eslint-disable-next-line prefer-const
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  return (
    <ToastBarProvider>
      <RCInstanceProvider value={{ RCInstance }}>
        <Box width={width}>
          <ChatHeader
            channelName={channelName}
            isClosable={isClosable}
            setClosableState={setClosableState}
            moreOpts={moreOpts}
            fullScreen={fullScreen}
            setFullScreen={setFullScreen}
            headerColor={headerColor}
          />
          {isUserAuthenticated || anonymousMode ? (
            <ChatBody
              height={!fullScreen ? height : '83vh'}
              anonymousMode={anonymousMode}
              showRoles={showRoles}
              GOOGLE_CLIENT_ID={GOOGLE_CLIENT_ID}
              FACEBOOK_APP_ID={FACEBOOK_APP_ID}
            />
          ) : (
            <Home height={!fullScreen ? height : '83vh'} />
          )}
          <ChatInput />
        </Box>
      </RCInstanceProvider>
    </ToastBarProvider>
  );
};

RCComponent.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isClosable: PropTypes.bool,
  setClosableState: PropTypes.func,
  moreOpts: PropTypes.bool,
  GOOGLE_CLIENT_ID: PropTypes.string,
  FACEBOOK_APP_ID: PropTypes.string,
  FACEBOOK_APP_SECRET: PropTypes.string,
  host: PropTypes.string,
  roomId: PropTypes.string,
  channelName: PropTypes.string,
  anonymousMode: PropTypes.bool,
  headerColor: PropTypes.string,
  toastBarPosition: PropTypes.string,
  showRoles: PropTypes.bool,
  showAvatar: PropTypes.bool,
};
