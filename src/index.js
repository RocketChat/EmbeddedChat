import { Box } from '@rocket.chat/fuselage';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ToastBarProvider } from '@rocket.chat/fuselage-toastbar';
import Cookies from 'js-cookie';
import { ChatBody, ChatHeader, ChatInput, Home } from './components';
import RocketChatInstance from './lib/api';
import { RCInstanceProvider } from './context/RCInstance';
import { useToastStore, useUserStore } from './store';

export const RCComponent = ({
  isClosable = false,
  setClosableState,
  moreOpts = false,
  width = '100%',
  height = '30vh',
  GOOGLE_CLIENT_ID,
  host = 'http://localhost:3000',
  roomId = 'GENERAL',
  channelName,
  anonymousMode = false,
  headerColor = '#fff',
  toastBarPosition = 'bottom-end',
}) => {
  const [fullScreen, setFullScreen] = useState(false);
  const setToastbarPosition = useToastStore((state) => state.setPosition);
  setToastbarPosition(toastBarPosition);

  const [messageToEdit, setMessageToEdit] = useState({});

  const handleMessageEdit = (msg) => {
    setMessageToEdit(msg)
  }

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
    const cookiesPresent = Cookies.get('rc_token') && Cookies.get('rc_uid');
    if (cookiesPresent) {
      setIsUserAuthenticated(true);
    }
  }, []);

  return (
    <ToastBarProvider>
      <RCInstanceProvider value={{ RCInstance }}>
        <Box width={width}>
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
              height={!fullScreen ? height : '83vh'}
              anonymousMode={anonymousMode}
              handleMessageEdit={handleMessageEdit}
              messageToEdit={messageToEdit}
            />
          ) : (
            <Home height={!fullScreen ? height : '83vh'} />
          )}
          <ChatInput GOOGLE_CLIENT_ID={GOOGLE_CLIENT_ID} messageToEdit={messageToEdit} handleMessageEdit={handleMessageEdit} />
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
  channelName: PropTypes.string,
  anonymousMode: PropTypes.bool,
  headerColor: PropTypes.string,
  toastBarPosition: PropTypes.string,
};
