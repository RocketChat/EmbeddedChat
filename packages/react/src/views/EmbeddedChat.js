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
  // Track if roomId was explicitly provided (not just the default)
  const [explicitRoomId, setExplicitRoomId] = useState(() => props.roomId);
  // Don't default to GENERAL if channelName is provided - wait for resolution
  const [resolvedRoomId, setResolvedRoomId] = useState(() => {
    // If roomId is explicitly provided, use it
    if (props.roomId) {
      return props.roomId;
    }
    // If channelName is provided, we'll resolve it, so start with null to indicate pending
    // Otherwise default to GENERAL
    return props.channelName ? null : 'GENERAL';
  });

  useEffect(() => {
    setConfig(props);
    // Track if roomId is explicitly provided
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
    // Use resolvedRoomId or fallback to GENERAL if not resolved yet
    // This ensures we always have a valid roomId for the RCInstance
    const roomIdToUse = resolvedRoomId || 'GENERAL';
    const newRCInstance = new EmbeddedChatApi(host, roomIdToUse, {
      getToken,
      deleteToken,
      saveToken,
    });

    return newRCInstance;
  }, [host, resolvedRoomId, getToken, deleteToken, saveToken]);

  // Initialize RCInstance - use GENERAL temporarily if resolving channelName
  const [RCInstance, setRCInstance] = useState(() => {
    // If we're resolving channelName (resolvedRoomId is null), use GENERAL temporarily
    // It will be re-instantiated when resolution completes
    const initialRoomId = resolvedRoomId || 'GENERAL';
    return new EmbeddedChatApi(host, initialRoomId, {
      getToken,
      deleteToken,
      saveToken,
    });
  });
  const setMessages = useMessageStore((state) => state.setMessages);
  const setChannelInfo = useChannelStore((state) => state.setChannelInfo);

  // Resolve roomId from channelName when channelName is provided and no explicit roomId
  // Priority: explicit roomId prop > resolved channelName > 'GENERAL'
  useEffect(() => {
    const resolveRoomId = async () => {
      // If roomId is explicitly provided, use it directly
      if (explicitRoomId) {
        setResolvedRoomId(explicitRoomId);
        return;
      }

      // If channelName is provided but no explicit roomId, resolve it to roomId
      if (channelName) {
        try {
          // We need auth token, but RCInstance might not be ready yet
          if (!RCInstance) {
            // Don't set resolvedRoomId yet - wait for RCInstance
            return;
          }

          // Wait for authentication before resolving
          if (!isUserAuthenticated) {
            // Not authenticated yet, wait for authentication - don't set to GENERAL
            return;
          }

          const currentUser = await RCInstance.auth.getCurrentUser();
          const authToken = currentUser?.authToken;
          const userId = currentUser?.userId || currentUser?._id;

          if (!authToken || !userId) {
            // No auth token available, wait - don't set to GENERAL yet
            return;
          }

          // Resolve channelName to roomId using the API
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
            // Handle 401 or other errors
            if (response.status === 401) {
              // Don't set to GENERAL - wait for auth to complete
              return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          if (data?.success && data?.room?._id) {
            // Successfully resolved channelName to roomId
            setResolvedRoomId(data.room._id);
          } else {
            // Fallback to GENERAL if resolution fails
            setResolvedRoomId('GENERAL');
          }
        } catch (error) {
          // Fallback to GENERAL on error
          setResolvedRoomId('GENERAL');
        }
      } else {
        // No channelName and no explicit roomId, use GENERAL
        setResolvedRoomId('GENERAL');
      }
    };

    resolveRoomId();
  }, [channelName, explicitRoomId, host, RCInstance, isUserAuthenticated]);

  useEffect(() => {
    const reInstantiate = async () => {
      // On first mount, mark as mounted
      if (!hasMounted.current) {
        hasMounted.current = true;
        previousResolvedRoomId.current = resolvedRoomId;
        // If resolvedRoomId is null, we're waiting for resolution - don't do anything yet
        if (resolvedRoomId === null) {
          return;
        }
        // If resolvedRoomId is already set on first mount, we're good (roomId was provided)
        return;
      }

      // If resolvedRoomId is null, we're still waiting for resolution
      // Don't re-instantiate yet - wait for resolution to complete
      if (resolvedRoomId === null) {
        return;
      }

      // Check if resolvedRoomId actually changed
      if (previousResolvedRoomId.current === resolvedRoomId) {
        // No change, don't re-instantiate
        return;
      }

      // Update the ref
      previousResolvedRoomId.current = resolvedRoomId;

      // First, close the old connection completely
      await RCInstance.close();

      // Clear messages and channel info AFTER closing old connection
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

      // Create new instance with new roomId
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
