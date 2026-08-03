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
import MatrixTheme from '../theme/MatrixTheme';
import { getTokenStorage } from '../lib/auth';
import { styles } from './EmbeddedChat.styles';
import GlobalStyles from './GlobalStyles';
import { overrideECProps } from '../lib/overrideECProps';

const EmbeddedChat = (props) => {
  const [remoteOverrides, setRemoteOverrides] = useState({});

  const config = useMemo(
    () => ({ ...props, ...remoteOverrides }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props, remoteOverrides]
  );

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
    auth: authProp = null,
    secure = false,
    dark = false,
    remoteOpt = false,
    layoutMode = 'bubble',
  } = config;

  const auth = useMemo(
    () => authProp ?? { flow: 'PASSWORD' },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authProp?.flow, authProp?.credentials]
  );

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
  const setMessages = useMessageStore((state) => state.setMessages);

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
  const rcInstanceRef = useRef(RCInstance);
  rcInstanceRef.current = RCInstance;

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const newRCInstance = initializeRCInstance();
    const oldRCInstance = rcInstanceRef.current;

    // Clear global state so that the UI resets and waits for new host's auth and data
    setIsUserAuthenticated(false);
    setAuthenticatedUsername(null);
    setAuthenticatedAvatarUrl(null);
    setAuthenticatedUserId(null);
    setAuthenticatedName(null);
    setAuthenticatedUserRoles([]);
    setMessages([]);

    setRCInstance(newRCInstance);
    oldRCInstance.close().catch((e) => console.error(e?.message || e));
  }, [
    roomId,
    host,
    initializeRCInstance,
    setIsUserAuthenticated,
    setAuthenticatedUsername,
    setAuthenticatedAvatarUrl,
    setAuthenticatedUserId,
    setAuthenticatedName,
    setAuthenticatedUserRoles,
    setMessages,
  ]);

  useEffect(
    () => () => {
      if (hasMounted.current) {
        rcInstanceRef.current
          .close()
          .catch((e) => console.error(e?.message || e));
      }
    },
    []
  );

  useEffect(() => {
    const autoLogin = async () => {
      setIsLoginIn(true);
      try {
        await RCInstance.autoLogin(auth);
      } catch (error) {
        console.error(error?.message || error);
      } finally {
        setIsLoginIn(false);
      }
    };
    autoLogin();
  }, [RCInstance, auth, setIsLoginIn]);

  useEffect(() => {
    const handleAuthChange = (user) => {
      if (user) {
        const { isChannelPrivate } = useChannelStore.getState();
        RCInstance.connect(isChannelPrivate)
          .then(() => {
            console.log(`Connected to RocketChat ${RCInstance.host}`);
            const me = user.me || user.data?.me;
            if (me) {
              setAuthenticatedAvatarUrl(me.avatarUrl);
              setAuthenticatedUsername(me.username);
              setAuthenticatedUserId(me._id);
              setAuthenticatedName(me.name);
              setAuthenticatedUserRoles(me.roles);
            }
            setIsUserAuthenticated(true);
          })
          .catch(console.error);
      } else {
        // Close the DDP connection on logout so the next login gets a fresh connection.
        RCInstance.close().catch(console.error);
        setIsUserAuthenticated(false);
      }
    };
    RCInstance.auth.onAuthChange(handleAuthChange);

    return () => {
      RCInstance.auth.removeAuthListener(handleAuthChange);
    };
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
          setRemoteOverrides((prev) => overrideECProps(prev, remoteConfig));
        }
      } catch (error) {
        console.error('Error fetching remote config:', error?.message || error);
      } finally {
        setIsSynced(true);
      }
    };
    if (remoteOpt) {
      getConfig();
    }
  }, [RCInstance, remoteOpt, setIsSynced]);

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
      layoutMode,
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
      layoutMode,
    ]
  );

  const RCContextValue = useMemo(
    () => ({ RCInstance, ECOptions }),
    [RCInstance, ECOptions]
  );

  const resolvedTheme = useMemo(() => {
    if (theme === 'matrix') {
      return MatrixTheme;
    }
    return theme || DefaultTheme;
  }, [theme]);

  if (!isSynced) return null;

  return (
    <ThemeProvider theme={resolvedTheme} mode={dark ? 'dark' : 'light'}>
      <RCInstanceProvider value={RCContextValue}>
        <Box
          css={[
            styles.embeddedchat(resolvedTheme, dark),
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
