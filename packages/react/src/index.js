import { Box } from '@rocket.chat/fuselage';
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ToastBarProvider } from '@rocket.chat/fuselage-toastbar';
// eslint-disable-next-line import/no-extraneous-dependencies
import { css, ThemeProvider } from '@emotion/react';
import Cookies from 'js-cookie';
import { EmbeddedChatApi } from '@embeddedchat/api';
import { ChatBody, ChatHeader, ChatInput, Home } from './components';
import { RCInstanceProvider } from './context/RCInstance';
import { useToastStore, useUserStore } from './store';
import { RC_USER_ID_COOKIE, RC_USER_TOKEN_COOKIE } from './lib/constant';
import AttachmentWindow from './components/Attachments/AttachmentWindow';
import useAttachmentWindowStore from './store/attachmentwindow';
import DefaultTheme from './theme/DefaultTheme';
import '@rocket.chat/icons/dist/rocketchat.css';

export const RCComponent = ({
  isClosable = false,
  setClosableState,
  moreOpts = false,
  width = '100%',
  height = '50vh',
  GOOGLE_CLIENT_ID,
  host = 'http://localhost:3000',
  roomId = 'GENERAL',
  channelName,
  anonymousMode = false,
  headerColor = '#fff',
  toastBarPosition = 'bottom-end',
  showRoles = false,
  showAvatar = false,
  enableThreads = false,
  theme = null,
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

  const [RCInstance, setRCInstance] = useState(
    () => new EmbeddedChatApi(host, roomId)
  );

  useEffect(() => {
    if (RCInstance.rcClient.loggedIn) {
      RCInstance.close();
      const newRCInstance = new EmbeddedChatApi(host, roomId);
      setRCInstance(newRCInstance);
    }
  }, [roomId, host]);

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
  const setAuthenticatedName = useUserStore((state) => state.setName);

  useEffect(() => {
    async function getUserEssentials() {
      const res = await RCInstance.me();
      if (res.status === 'error') {
        setIsUserAuthenticated(false);
      } else {
        setAuthenticatedUserAvatarUrl(res.avatarUrl);
        setAuthenticatedUserUsername(res.username);
        setAuthenticatedUserId(res._id);
        setAuthenticatedName(res.name);
      }
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
  }, [RCInstance]);

  const attachmentWindowOpen = useAttachmentWindowStore((state) => state.open);

  const ECOptions = useMemo(
    () => ({
      enableThreads,
    }),
    [enableThreads]
  );

  return (
    <ThemeProvider theme={theme || DefaultTheme}>
      <ToastBarProvider>
        <RCInstanceProvider value={{ RCInstance, ECOptions }}>
          {attachmentWindowOpen ? <AttachmentWindow /> : null}
          <Box
            css={css`
              display: flex;
              flex-direction: column;
              width: ${width};
              overflow: hidden;
              max-height: 100vh;
            `}
          >
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
                height={!fullScreen ? height : '88vh'}
                anonymousMode={anonymousMode}
                showRoles={showRoles}
                GOOGLE_CLIENT_ID={GOOGLE_CLIENT_ID}
              />
            ) : (
              <Home height={!fullScreen ? height : '88vh'} />
            )}
            <ChatInput />
          </Box>
        </RCInstanceProvider>
      </ToastBarProvider>
    </ThemeProvider>
  );
};

RCComponent.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isClosable: PropTypes.bool,
  setClosableState: PropTypes.func,
  moreOpts: PropTypes.bool,
  GOOGLE_CLIENT_ID: PropTypes.string,
  host: PropTypes.string,
  roomId: PropTypes.string,
  channelName: PropTypes.string,
  anonymousMode: PropTypes.bool,
  headerColor: PropTypes.string,
  toastBarPosition: PropTypes.string,
  showRoles: PropTypes.bool,
  showAvatar: PropTypes.bool,
  enableThreads: PropTypes.bool,
  theme: PropTypes.object,
};
