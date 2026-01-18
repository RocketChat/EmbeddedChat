import React, { memo, useEffect, useMemo, useState, useCallback } from 'react';
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
import {
  useUserStore,
  useLoginStore,
  useMessageStore,
  useChannelStore,
} from '../store';
import DefaultTheme from '../theme/DefaultTheme';
import { getTokenStorage } from '../lib/auth';
import { styles } from './EmbeddedChat.styles';
import GlobalStyles from './GlobalStyles';
import { overrideECProps } from '../lib/overrideECProps';
import { useRoomId } from '../hooks/useRoomId';

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

  const { classNames, styleOverrides } = useComponentOverrides('EmbeddedChat');
  const [fullScreen, setFullScreen] = useState(false);
  const [isSynced, setIsSynced] = useState(!remoteOpt);
  const {
    setIsUserAuthenticated,
    setUsername: setAuthenticatedUsername,
    setUserAvatarUrl: setAuthenticatedAvatarUrl,
    setUserId: setAuthenticatedUserId,
    setName: setAuthenticatedName,
    setRoles: setAuthenticatedUserRoles,
    isUserAuthenticated,
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

  const { getToken, saveToken, deleteToken } = getTokenStorage(secure);
  const { roomId: resolvedRoomId, error: roomIdError } = useRoomId(
    roomId,
    channelName,
    host,
    getToken,
    deleteToken,
    saveToken,
    isUserAuthenticated
  );

  const RCInstance = useMemo(() => {
    const roomIdToUse = resolvedRoomId || roomId || 'GENERAL';
    try {
      return new EmbeddedChatApi(host, roomIdToUse, {
        getToken,
        deleteToken,
        saveToken,
      });
    } catch (error) {
      console.error('Failed to create RCInstance:', error);
      return null;
    }
  }, [host, resolvedRoomId, roomId, getToken, deleteToken, saveToken]);

  const setMessages = useMessageStore((state) => state.setMessages);
  const setChannelInfo = useChannelStore((state) => state.setChannelInfo);

  useEffect(() => {
    if (resolvedRoomId === null || !RCInstance) {
      return;
    }

    const cleanup = async () => {
      setMessages([], false);
      setChannelInfo({});
      useMessageStore.setState({
        messages: [],
        threadMessages: [],
        filtered: false,
        threadMainMessage: null,
        deletedMessage: {},
        quoteMessage: [],
        editMessage: {},
        messagesOffset: 0,
        isMessageLoaded: false,
      });
    };

    cleanup();

    return () => {
      RCInstance.close().catch(console.error);
    };
  }, [resolvedRoomId, setMessages, setChannelInfo, RCInstance]);

  useEffect(() => {
    if (!RCInstance) {
      return;
    }
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
    if (!RCInstance) {
      return;
    }
    RCInstance.auth.onAuthChange((user) => {
      if (user) {
        RCInstance.connect()
          .then(() => {
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
    if (!RCInstance) {
      setIsSynced(true);
      return;
    }
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
      roomId: resolvedRoomId,
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

  const RCContextValue = useMemo(() => {
    if (!RCInstance) {
      return { RCInstance: null, ECOptions };
    }
    return { RCInstance, ECOptions };
  }, [RCInstance, ECOptions]);

  if (!isSynced) return null;

  if (roomIdError && !RCInstance) {
    return (
      <ThemeProvider
        theme={theme || DefaultTheme}
        mode={dark ? 'dark' : 'light'}
      >
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
          <ToastBarProvider position={toastBarPosition}>
            {hideHeader ? null : (
              <ChatHeader
                isClosable={isClosable}
                setClosableState={setClosableState}
                fullScreen={fullScreen}
                setFullScreen={setFullScreen}
              />
            )}
            <Box
              css={css`
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                padding: 20px;
                text-align: center;
              `}
            >
              <Box>
                <Box
                  css={css`
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 8px;
                  `}
                >
                  {roomIdError}
                </Box>
                <Box
                  css={css`
                    font-size: 0.9rem;
                    opacity: 0.7;
                  `}
                >
                  Please check the channel name and try again.
                </Box>
              </Box>
            </Box>
          </ToastBarProvider>
        </Box>
      </ThemeProvider>
    );
  }

  if (!RCInstance) {
    return null;
  }

  return (
    <ThemeProvider theme={theme || DefaultTheme} mode={dark ? 'dark' : 'light'}>
      <RCInstanceProvider
        key={resolvedRoomId || 'pending'}
        value={RCContextValue}
      >
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
          <ToastBarProvider position={toastBarPosition}>
            {hideHeader ? null : (
              <ChatHeader
                isClosable={isClosable}
                setClosableState={setClosableState}
                fullScreen={fullScreen}
                setFullScreen={setFullScreen}
              />
            )}

            <ChatLayout />

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
