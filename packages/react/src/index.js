import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ToastBarProvider } from '@rocket.chat/fuselage-toastbar';
// eslint-disable-next-line import/no-extraneous-dependencies
import { css, ThemeProvider } from '@emotion/react';
import { EmbeddedChatApi } from '@embeddedchat/api';
import { ChatBody, ChatHeader, ChatInput, Home } from './components';
import { RCInstanceProvider } from './context/RCInstance';
import { useToastStore, useUserStore } from './store';
import AttachmentWindow from './components/Attachments/AttachmentWindow';
import useAttachmentWindowStore from './store/attachmentwindow';
import DefaultTheme from './theme/DefaultTheme';
import '@rocket.chat/icons/dist/rocketchat.css';
import { deleteToken, getToken, saveToken } from './lib/auth';
import { Box } from './components/Box';

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
  auth = {
    flow: 'MANAGED',
  },
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

  const [RCInstance, setRCInstance] = useState(() => {
    const newRCInstance = new EmbeddedChatApi(host, roomId, {
      getToken,
      deleteToken,
      saveToken,
      autoLogin: auth.flow === 'MANAGED',
    });
    if (auth.flow === 'TOKEN') {
      newRCInstance.auth.loginWithOAuthServiceToken(auth.credentials);
    }
    return newRCInstance;
  });

  useEffect(() => {
    if (RCInstance.rcClient.loggedIn()) {
      RCInstance.close();
      const newRCInstance = new EmbeddedChatApi(host, roomId, {
        getToken,
        deleteToken,
        saveToken,
        autoLogin: auth.flow === 'MANAGED',
      });
      if (auth.flow === 'TOKEN') {
        newRCInstance.auth.loginWithOAuthServiceToken(auth.credentials);
      }
      setRCInstance(newRCInstance);
    }
  }, [roomId, host, auth?.flow]);

  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  const setAuthenticatedUserUsername = useUserStore(
    (state) => state.setUsername
  );
  const setAuthenticatedUserAvatarUrl = useUserStore(
    (state) => state.setUserAvatarUrl
  );
  const setAuthenticatedUserId = useUserStore((state) => state.setUserId);
  const setAuthenticatedName = useUserStore((state) => state.setName);

  useEffect(() => {
    RCInstance.auth.onAuthChange((user) => {
      // getUserEssentials();
      if (user) {
        const { me } = user;
        setAuthenticatedUserAvatarUrl(me.avatarUrl);
        setAuthenticatedUserUsername(me.username);
        setAuthenticatedUserId(me._id);
        setAuthenticatedName(me.name);
        setIsUserAuthenticated(true);
      } else {
        setIsUserAuthenticated(false);
      }
    });
  }, [RCInstance]);

  const attachmentWindowOpen = useAttachmentWindowStore((state) => state.open);

  const ECOptions = useMemo(
    () => ({
      enableThreads,
      authFlow: auth.flow,
    }),
    [enableThreads, auth.flow]
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
  auth: PropTypes.oneOfType([
    PropTypes.shape({ flow: PropTypes.oneOf(['MANAGED']) }),
    PropTypes.shape({
      flow: PropTypes.oneOf(['TOKEN']),
      credentials: PropTypes.object,
    }),
  ]),
};
