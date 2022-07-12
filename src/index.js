import { Box } from '@rocket.chat/fuselage';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ChatBody, ChatHeader, ChatInput, Home } from './components';
import RocketChatInstance from './lib/api';
import { RCInstanceProvider } from './context/RCInstance';
import { ToastBarProvider } from '@rocket.chat/fuselage-toastbar';
import { useUserStore } from './store';

export const RCComponent = ({
  isClosable = false,
  setClosableState,
  moreOpts = false,
  width = '100%',
  height = '30vh',
  GOOGLE_CLIENT_ID,
  host = 'http://localhost:3000',
  roomId = 'GENERAL',
}) => {
  const [fullScreen, setFullScreen] = useState(false);

  if (isClosable && !setClosableState) {
    throw Error(
      'Please provide a setClosableState to props when isClosable = true'
    );
  }

  const RCInstance = new RocketChatInstance(host, roomId);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  useEffect(() => {
    async function checkIfUserAuthenticated() {
      const data = await RCInstance.me();
      if (data.name) {
        setIsUserAuthenticated(true);
      } else {
        setIsUserAuthenticated(false);
      }
    }
    if (RCInstance.getCookies().rc_token && RCInstance.getCookies().rc_uid) {
      checkIfUserAuthenticated();
    }
  }, []);

  return (
    <ToastBarProvider>
      <RCInstanceProvider value={{ RCInstance }}>
        <Box width={width}>
          <ChatHeader
            isClosable={isClosable}
            setClosableState={setClosableState}
            moreOpts={moreOpts}
            fullScreen={fullScreen}
            setFullScreen={setFullScreen}
          />
          {isUserAuthenticated ? (
            <ChatBody height={!fullScreen ? height : '83vh'} />
          ) : (
            <Home
              GOOGLE_CLIENT_ID={GOOGLE_CLIENT_ID}
              height={!fullScreen ? height : '83vh'}
            />
          )}
          <ChatInput />
        </Box>
      </RCInstanceProvider>
    </ToastBarProvider>
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
};
