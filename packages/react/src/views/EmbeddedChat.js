import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { css, ThemeProvider } from '@emotion/react';
import { EmbeddedChatApi } from '@embeddedchat/api';
import { ChatLayout } from './ChatLayout';
import { ChatHeader } from './ChatHeader';
import { Home } from './Home';
import { RCInstanceProvider } from '../context/RCInstance';
import { useUserStore } from '../store';
import DefaultTheme from '../theme/DefaultTheme';
import { deleteToken, getToken, saveToken } from '../lib/auth';
import { Box } from '../components/Box';
import useComponentOverrides from '../hooks/useComponentOverrides';
import { ToastBarProvider } from '../components/ToastBar';
import { styles } from './EmbeddedChat.styles';
import GlobalStyles from './GlobalStyles';

const EmbeddedChat = ({
  isClosable = false,
  setClosableState = () => {},
  width = '100%',
  height = '95vh',
  host = 'http://localhost:3000',
  roomId = 'GENERAL',
  channelName,
  anonymousMode = false,
  toastBarPosition = 'bottom right',
  showRoles = false,
  showAvatar = true,
  showUsername = false,
  showName = true,
  enableThreads = false,
  theme = null,
  className = '',
  style = {},
  hideHeader = false,
  auth = {
    flow: 'PASSWORD',
  },
  secure = false,
  dark = false,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('EmbeddedChat');
  const [fullScreen, setFullScreen] = useState(false);

  const {
    isUserAuthenticated,
    setIsUserAuthenticated,
    setUsername: setAuthenticatedUsername,
    setUserAvatarUrl: setAuthenticatedAvatarUrl,
    setUserId: setAuthenticatedUserId,
    setName: setAuthenticatedName,
    setRoles: setAuthenticatedUserRoles,
  } = useUserStore((state) => ({
    isUserAuthenticated: state.isUserAuthenticated,
    setIsUserAuthenticated: state.setIsUserAuthenticated,
    setUserAvatarUrl: state.setUserAvatarUrl,
    setUserId: state.setUserId,
    setName: state.setName,
    setUsername: state.setUsername,
    setRoles: state.setRoles,
  }));

  if (isClosable && !setClosableState) {
    throw Error(
      'Please provide a setClosableState to props when isClosable = true'
    );
  }

  const initializeRCInstance = useCallback(() => {
    const newRCInstance = new EmbeddedChatApi(host, roomId, {
      getToken,
      deleteToken,
      saveToken,
      autoLogin: ['PASSWORD', 'OAUTH'].includes(auth?.flow),
    });
    if (auth?.flow === 'TOKEN') {
      newRCInstance.auth.loginWithOAuthServiceToken(auth.credentials);
    }
    return newRCInstance;
  }, [host, roomId, auth?.flow, auth?.credentials]);

  const [RCInstance, setRCInstance] = useState(() => initializeRCInstance());

  useEffect(() => {
    const reInstantiate = () => {
      const newRCInstance = initializeRCInstance();
      setRCInstance(newRCInstance);
    };

    if (RCInstance.rcClient.loggedIn()) {
      RCInstance.close().then(reInstantiate).catch(console.error);
    } else {
      reInstantiate();
    }
  }, [roomId, host, auth?.flow]);

  useEffect(() => {
    RCInstance.auth.onAuthChange((user) => {
      if (user) {
        RCInstance.connect()
          .then(() => {
            console.log(`Connected to RocketChat ${RCInstance.host}`);
            console.log('reinstantiated');
            const { me } = user;
            setAuthenticatedAvatarUrl(me.avatarUrl);
            setAuthenticatedUsername(me.username);
            setAuthenticatedUserId(me._id);
            setAuthenticatedName(me.name);
            setAuthenticatedUserRoles(me.roles);
            setIsUserAuthenticated(true);
          })
          .catch(console.error);
      } else {
        setIsUserAuthenticated(false);
      }
    });
  }, [
    RCInstance,
    setAuthenticatedName,
    setAuthenticatedUserId,
    setAuthenticatedUserRoles,
    setIsUserAuthenticated,
    setAuthenticatedAvatarUrl,
    setAuthenticatedUsername,
  ]);

  const ECOptions = useMemo(
    () => ({
      enableThreads,
      authFlow: auth.flow,
      width,
      height,
      host,
      roomId,
      channelName,
      showName,
      showRoles,
      showAvatar,
      showUsername,
      hideHeader,
      anonymousMode,
      mode: dark ? 'dark' : 'light',
    }),
    [
      enableThreads,
      auth.flow,
      width,
      height,
      host,
      roomId,
      channelName,
      showName,
      showRoles,
      showAvatar,
      showUsername,
      hideHeader,
      anonymousMode,
      dark,
    ]
  );

  const RCContextValue = useMemo(
    () => ({ RCInstance, ECOptions }),
    [RCInstance, ECOptions]
  );

  return (
    <ThemeProvider theme={theme || DefaultTheme}>
      <RCInstanceProvider value={RCContextValue}>
        <GlobalStyles />
        <Box
          css={[
            styles.embeddedchat(theme || DefaultTheme, dark),
            css`
              width: ${width};
              height: ${height};
              position: relative;
            `,
            fullScreen && styles.fullscreen,
          ]}
          className={`ec-embedded-chat ${className} ${classNames}`}
          style={{ ...style, ...styleOverrides }}
        >
          <ToastBarProvider position={toastBarPosition}>
            {hideHeader ? null : (
              <ChatHeader
                isClosable={isClosable}
                setClosableState={setClosableState}
                fullScreen={fullScreen}
                setFullScreen={setFullScreen}
              />
            )}

            {isUserAuthenticated || anonymousMode ? (
              <ChatLayout />
            ) : (
              <Home height={!fullScreen ? height : '88vh'} />
            )}

            <div id="overlay-items" />
          </ToastBarProvider>
        </Box>
      </RCInstanceProvider>
    </ThemeProvider>
  );
};

EmbeddedChat.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  isClosable: PropTypes.bool,
  setClosableState: PropTypes.func,
  host: PropTypes.string,
  roomId: PropTypes.string,
  channelName: PropTypes.string,
  anonymousMode: PropTypes.bool,
  toastBarPosition: PropTypes.string,
  showRoles: PropTypes.bool,
  showAvatar: PropTypes.bool,
  enableThreads: PropTypes.bool,
  theme: PropTypes.object,
  auth: PropTypes.oneOfType([
    PropTypes.shape({ flow: PropTypes.oneOf(['PASSWORD']) }),
    PropTypes.shape({ flow: PropTypes.oneOf(['OAUTH']) }),
    PropTypes.shape({
      flow: PropTypes.oneOf(['TOKEN']),
      credentials: PropTypes.object,
    }),
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
  hideHeader: PropTypes.bool,
  dark: PropTypes.bool,
};

export default memo(EmbeddedChat);
