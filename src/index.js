import { Box } from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChatBody, ChatHeader, ChatInput } from './components';
import RocketChatInstance from './lib/api';
import { RCInstanceProvider } from './context/RCInstance';

export const RCComponent = ({
  isClosable = false,
  setClosableState,
  moreOpts = false,
  width = '100%',
  height = '30vh',
}) => {
  const [fullScreen, setFullScreen] = useState(false);

  if (isClosable && !setClosableState) {
    throw Error(
      'Please provide a setClosableState to props when isClosable = true'
    );
  }

  const RCInstance = new RocketChatInstance('http://localhost:3000', 'GENERAL');

  return (
    <RCInstanceProvider value={{ RCInstance }}>
      <Box width={width}>
        <ChatHeader
          isClosable={isClosable}
          setClosableState={setClosableState}
          moreOpts={moreOpts}
          fullScreen={fullScreen}
          setFullScreen={setFullScreen}
        />
        <ChatBody height={!fullScreen ? height : '83vh'} />
        <ChatInput />
      </Box>
    </RCInstanceProvider>
  );
};

RCComponent.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isClosable: PropTypes.bool,
  setClosableState: PropTypes.func,
  moreOpts: PropTypes.bool,
};
