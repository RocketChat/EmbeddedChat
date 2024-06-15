import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { css, ThemeProvider } from '@emotion/react';
import { EmbeddedChatApi } from '@embeddedchat/api';
import { ChatLayout } from './ChatLayout';
import { ChatHeader } from './ChatHeader';
import { Home } from './Home';
import { RCInstanceProvider } from '../context/RCInstance';
import { useToastStore, useUserStore, useThemeStore } from '../store';
import AttachmentPreview from './AttachmentPreview/AttachmentPreview';
import CheckPreviewType from './AttachmentPreview/CheckPreviewType';
import useAttachmentWindowStore from '../store/attachmentwindow';
import DefaultTheme from '../theme/DefaultTheme';
import { deleteToken, getToken, saveToken } from '../lib/auth';
import { Box } from '../components/Box';
import useComponentOverrides from '../hooks/useComponentOverrides';
import useDropBox from '../hooks/useDropBox';
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
  dark = false,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('EmbeddedChat');
  const [fullScreen, setFullScreen] = useState(false);
  const messageListRef = useRef(null);
  const {
    setShowAvatar,
    setShowRoles,
    setShowUsername,
    setShowName,
    isUserAuthenticated,
    setIsUserAuthenticated,
    setUsername: setAuthenticatedUserUsername,
    setUserAvatarUrl: setAuthenticatedUserAvatarUrl,
    setUserId: setAuthenticatedUserId,
    setName: setAuthenticatedName,
    setRoles: setAuthenticatedUserRoles,
  } = useUserStore((state) => ({
    setShowAvatar: state.setShowAvatar,
    setShowRoles: state.setShowRoles,
    setShowUsername: state.setShowUsername,
    setShowName: state.setShowName,
    isUserAuthenticated: state.isUserAuthenticated,
    setIsUserAuthenticated: state.setIsUserAuthenticated,
    setUsername: state.setUsername,
    setUserAvatarUrl: state.setUserAvatarUrl,
    setUserId: state.setUserId,
    setName: state.setName,
    setRoles: state.setRoles,
  }));

  const { setDark: setDarkMode, setLight: setLightMode } = useThemeStore(
    (state) => ({
      setDark: state.setDark,
      setLight: state.setLight,
    })
  );

  const setToastbarPosition = useToastStore((state) => state.setPosition);
  const attachmentWindowOpen = useAttachmentWindowStore(
    (state) => state.attachmentWindowOpen
  );
  const { data, handleDrag, handleDragDrop } = useDropBox();

  if (isClosable && !setClosableState) {
    throw Error(
      'Please provide a setClosableState to props when isClosable = true'
    );
  }

  const scrollToBottom = () => {
    if (messageListRef && messageListRef.current) {
      requestAnimationFrame(() => {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      });
    }
  };

  const initializeRCInstance = () => {
    const newRCInstance = new EmbeddedChatApi(host, roomId, {
      getToken,
      deleteToken,
      saveToken,
      autoLogin: ['PASSWORD', 'OAUTH'].includes(auth.flow),
    });
    if (auth.flow === 'TOKEN') {
      newRCInstance.auth.loginWithOAuthServiceToken(auth.credentials);
    }
    return newRCInstance;
  };

  const [RCInstance, setRCInstance] = useState(initializeRCInstance);

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
            setAuthenticatedUserAvatarUrl(me.avatarUrl);
            setAuthenticatedUserUsername(me.username);
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
    setAuthenticatedUserAvatarUrl,
    setAuthenticatedUserId,
    setAuthenticatedUserUsername,
    setAuthenticatedUserRoles,
    setIsUserAuthenticated,
  ]);

  useEffect(() => {
    setToastbarPosition(toastBarPosition);
    setShowAvatar(showAvatar);
    setShowRoles(showRoles);
    setShowUsername(showUsername);
    setShowName(showName);
    dark ? setDarkMode() : setLightMode();
  }, [
    toastBarPosition,
    showAvatar,
    setShowAvatar,
    setToastbarPosition,
    showRoles,
    setShowRoles,
    dark,
    setDarkMode,
    setLightMode,
    showUsername,
    setShowUsername,
    setShowName,
    showName,
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
      showRoles,
      showAvatar,
      hideHeader,
      anonymousMode,
      dark,
    }),
    [
      enableThreads,
      auth.flow,
      width,
      height,
      host,
      roomId,
      channelName,
      showRoles,
      showAvatar,
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
      <GlobalStyles />
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
          onDragOver={(e) => handleDrag(e)}
          onDrop={(e) => handleDragDrop(e)}
        >
          <ToastBarProvider position={toastBarPosition}>
            {hideHeader ? null : (
              <ChatHeader
                channelName={channelName}
                isClosable={isClosable}
                setClosableState={setClosableState}
                fullScreen={fullScreen}
                setFullScreen={setFullScreen}
                anonymousMode={anonymousMode}
                showRoles={showRoles}
              />
            )}

            {isUserAuthenticated || anonymousMode ? (
              <ChatLayout
                anonymousMode={anonymousMode}
                showRoles={showRoles}
                messageListRef={messageListRef}
                scrollToBottom={scrollToBottom}
              />
            ) : (
              <Home height={!fullScreen ? height : '88vh'} />
            )}

            {attachmentWindowOpen ? (
              data ? (
                <>
                  <AttachmentPreview />
                </>
              ) : (
                <CheckPreviewType data={data} />
              )
            ) : null}
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
