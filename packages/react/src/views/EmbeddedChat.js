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

const EmbeddedChat = (props) => {
  const [config, setConfig] = useState(() => props);
  const [explicitRoomId, setExplicitRoomId] = useState(() => props.roomId);
  const [resolvedRoomId, setResolvedRoomId] = useState(() => {
    if (props.roomId) {
      return props.roomId;
    }
    return props.channelName ? null : 'GENERAL';
  });

  useEffect(() => {
    setConfig(props);
    setExplicitRoomId(props.roomId);
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
  const previousResolvedRoomId = useRef(resolvedRoomId);
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

  const initializeRCInstance = useCallback(() => {
    const roomIdToUse = resolvedRoomId || 'GENERAL';
    const newRCInstance = new EmbeddedChatApi(host, roomIdToUse, {
      getToken,
      deleteToken,
      saveToken,
    });

    return newRCInstance;
  }, [host, resolvedRoomId, getToken, deleteToken, saveToken]);

  const [RCInstance, setRCInstance] = useState(() => {
    const initialRoomId = resolvedRoomId || 'GENERAL';
    return new EmbeddedChatApi(host, initialRoomId, {
      getToken,
      deleteToken,
      saveToken,
    });
  });
  const setMessages = useMessageStore((state) => state.setMessages);
  const setChannelInfo = useChannelStore((state) => state.setChannelInfo);

  useEffect(() => {
    const resolveRoomId = async () => {
      if (explicitRoomId) {
        setResolvedRoomId(explicitRoomId);
        return;
      }

      if (channelName) {
        try {
          if (!RCInstance) {
            return;
          }

          if (!isUserAuthenticated) {
            return;
          }

          const currentUser = await RCInstance.auth.getCurrentUser();
          const authToken = currentUser?.authToken;
          const userId = currentUser?.userId || currentUser?._id;

          if (!authToken || !userId) {
            return;
          }

          const response = await fetch(
            `${host}/api/v1/rooms.info?roomName=${encodeURIComponent(
              channelName
            )}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': authToken,
                'X-User-Id': userId,
              },
            }
          );

          if (!response.ok) {
            if (response.status === 401) {
              return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data?.success && data?.room?._id) {
            setResolvedRoomId(data.room._id);
          } else {
            setResolvedRoomId('GENERAL');
          }
        } catch (error) {
          setResolvedRoomId('GENERAL');
        }
      } else {
        setResolvedRoomId('GENERAL');
      }
    };

    resolveRoomId();
  }, [channelName, explicitRoomId, host, RCInstance, isUserAuthenticated]);

  useEffect(() => {
    const reInstantiate = async () => {
      if (!hasMounted.current) {
        hasMounted.current = true;
        previousResolvedRoomId.current = resolvedRoomId;
        if (resolvedRoomId === null) {
          return;
        }
        return;
      }

      if (resolvedRoomId === null) {
        return;
      }

      if (previousResolvedRoomId.current === resolvedRoomId) {
        return;
      }

      previousResolvedRoomId.current = resolvedRoomId;

      await RCInstance.close();

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

      const newRCInstance = initializeRCInstance();
      setRCInstance(newRCInstance);
    };

    reInstantiate().catch(console.error);

    return () => {
      RCInstance.close().catch(console.error);
    };
  }, [
    resolvedRoomId,
    host,
    initializeRCInstance,
    setMessages,
    setChannelInfo,
    RCInstance,
  ]);

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
