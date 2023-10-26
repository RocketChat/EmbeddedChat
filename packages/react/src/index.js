import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import { css, ThemeProvider } from '@emotion/react';
import { EmbeddedChatApi } from '@embeddedchat/api';
import { ChatBody, ChatHeader, ChatInput, Home } from './components';
import { RCInstanceProvider } from './context/RCInstance';
import { useToastStore, useUserStore } from './store';
import AttachmentWindow from './components/Attachments/AttachmentWindow';
import useAttachmentWindowStore from './store/attachmentwindow';
import DefaultTheme from './theme/DefaultTheme';
import { deleteToken, getToken, saveToken } from './lib/auth';
import { Box } from './components/Box';
import useComponentOverrides from './theme/useComponentOverrides';
import { ToastBarProvider } from './components/ToastBar';

// Include scrollbar styles directly in JavaScript
const scrollbarStyles = `
  /* Style the main scrollbar */
  ::-webkit-scrollbar {
    width: 12px;
  }

  /* Style the scrollbar thumb (the draggable part) */
  ::-webkit-scrollbar-thumb {
    background: #7f7f7f;
    border-radius: 12px;
  }

  /* Style the scrollbar thumb on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555555;
  }

  /* Style the scrollbar track (the background) */
  ::-webkit-scrollbar-track {
    background: #ffffff;
  }
`;

const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = scrollbarStyles;
document.getElementsByTagName('head')[0].appendChild(style);

export const EmbeddedChat = ({
  isClosable = false,
  setClosableState,
  moreOpts = false,
  width = '100%',
  height = '50vh',
  host = process.env.STORYBOOK_RC_HOST || 'http://localhost:3000',
  roomId = 'GENERAL',
  channelName,
  anonymousMode = false,
  headerColor = '#fff',
  toastBarPosition = 'bottom right',
  showRoles = false,
  showAvatar = false,
  enableThreads = false,
  theme = null,
  className = '',
  style = {},
  hideHeader = false,
  auth = {
    flow: 'MANAGED',
  },
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('EmbeddedChat');
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
    const reInstantiate = () => {
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
    };

    if (RCInstance.rcClient.loggedIn()) {
      RCInstance.close().then(reInstantiate).catch(console.error);
    } else {
      reInstantiate();
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
        RCInstance.connect()
          .then(() => {
            console.log(`Connected to RocketChat ${RCInstance.host}`);
          })
          .catch(console.error);
        console.log('reinstantiated');
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
      <ToastBarProvider position={toastBarPosition}>
        <RCInstanceProvider value={{ RCInstance, ECOptions }}>
          {attachmentWindowOpen ? <AttachmentWindow /> : null}
          <Box
            css={css`
              display: flex;
              flex-direction: column;
              width: ${width};
              overflow: hidden;
              max-height: 100vh;
              height: ${height};
            `}
            className={`ec-embedded-chat ${className} ${classNames}`}
            style={{ ...style, ...styleOverrides }}
          >
            {hideHeader ? null : (
              <ChatHeader
                channelName={channelName}
                isClosable={isClosable}
                setClosableState={setClosableState}
                moreOpts={moreOpts}
                fullScreen={fullScreen}
                setFullScreen={setFullScreen}
                headerColor={headerColor}
              />
            )}
            {isUserAuthenticated || anonymousMode ? (
              <ChatBody
                height={!fullScreen ? height : '88vh'}
                anonymousMode={anonymousMode}
                showRoles={showRoles}
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

EmbeddedChat.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  isClosable: PropTypes.bool,
  setClosableState: PropTypes.func,
  moreOpts: PropTypes.bool,
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
  className: PropTypes.string,
  style: PropTypes.object,
  hideHeader: PropTypes.bool,
};
