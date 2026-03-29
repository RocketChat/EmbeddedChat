import React, {
  memo,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { EmbeddedChatApi } from '@embeddedchat/api';
import {
  Box,
  ToastBarProvider,
  useComponentOverrides,
  ThemeProvider,
} from '@embeddedchat/ui-elements';
import { ChatLayout } from './ChatLayout';
import { ChatHeader } from './ChatHeader';
import { RCInstanceProvider } from '../context/RCInstance';
import { useUserStore, useLoginStore, useMessageStore } from '../store';
import DefaultTheme from '../theme/DefaultTheme';
import { getTokenStorage } from '../lib/auth';
import { styles } from './EmbeddedChat.styles';
import GlobalStyles from './GlobalStyles';
import { overrideECProps } from '../lib/overrideECProps';

const EmbeddedChat = (props) => {
  const [config, setConfig] = useState(() => props);

  useEffect(() => {
    setConfig(props);
  }, [props]);

  const {
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
    showAnnouncement = true,
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
    remoteOpt = false,
  } = config;

  const hasMounted = useRef(false);
  const { classNames, styleOverrides } = useComponentOverrides('EmbeddedChat');
  const [fullScreen, setFullScreen] = useState(false);
  const [isSynced, setIsSynced] = useState(!remoteOpt);
  const { getToken, saveToken, deleteToken } = getTokenStorage(secure);
  const {
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

  const setIsLoginIn = useLoginStore((state) => state.setIsLoginIn);
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
    });

    return newRCInstance;
  }, [host, roomId, getToken, deleteToken, saveToken]);

  const [RCInstance, setRCInstance] = useState(() => initializeRCInstance());

  useEffect(() => {
    const reInstantiate = () => {
      const newRCInstance = initializeRCInstance();
      setRCInstance(newRCInstance);
    };

    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    RCInstance.close().then(reInstantiate).catch(console.error);

    return () => {
      RCInstance.close().catch(console.error);
    };
  }, [roomId, host, initializeRCInstance]);

  useEffect(() => {
    const autoLogin = async () => {
      setIsLoginIn(true);
      try {
        await RCInstance.autoLogin(auth);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoginIn(false);
      }
    };
    autoLogin();
  }, [RCInstance, auth, setIsLoginIn]);

  useEffect(() => {
    RCInstance.auth.onAuthChange((user) => {
      if (user) {
        RCInstance.connect()
          .then(() => {
            console.log(`Connected to RocketChat ${RCInstance.host}`);
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

  useEffect(() => {
    const getConfig = async () => {
      try {
        const appInfo = await RCInstance.getRCAppInfo();

        if (appInfo) {
          const remoteConfig = appInfo.propConfig;
          setConfig((prevConfig) => overrideECProps(prevConfig, remoteConfig));
        }
      } catch (error) {
        console.error('Error fetching remote config:', error);
      } finally {
        setIsSynced(true);
      }
    };
    if (remoteOpt) {
      getConfig();
    }
  }, [RCInstance, remoteOpt, setConfig, setIsSynced]);

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
      showAnnouncement,
      showUsername,
      hideHeader,
      anonymousMode,
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
      showAnnouncement,
      showUsername,
      hideHeader,
      anonymousMode,
    ]
  );

  const RCContextValue = useMemo(
    () => ({ RCInstance, ECOptions }),
    [RCInstance, ECOptions]
  );

  if (!isSynced) return null;

  return (
    <ThemeProvider theme={theme || DefaultTheme} mode={dark ? 'dark' : 'light'}>
      <RCInstanceProvider value={RCContextValue}>
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
          <GlobalStyles />
          <a
            href="#ec-chat-main"
            style={{
              position: 'absolute',
              top: '-999px',
              left: '-999px',
              zIndex: 9999,
              padding: '8px 16px',
              background: '#1d74f5',
              color: '#fff',
              borderRadius: '4px',
              fontWeight: 700,
              fontSize: '13px',
              textDecoration: 'none',
            }}
            onFocus={(e) => {
              e.target.style.top = '8px';
              e.target.style.left = '8px';
            }}
            onBlur={(e) => {
              e.target.style.top = '-999px';
              e.target.style.left = '-999px';
            }}
          >
            Skip to chat
          </a>
          <ToastBarProvider position={toastBarPosition}>
            {hideHeader ? null : (
              <ChatHeader
                isClosable={isClosable}
                setClosableState={setClosableState}
                fullScreen={fullScreen}
                setFullScreen={setFullScreen}
              />
            )}

            <div id="ec-chat-main" tabIndex={-1} style={{ outline: 'none', display: 'contents' }}>
              <ChatLayout />
            </div>

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
  showAnnouncement: PropTypes.bool,
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
