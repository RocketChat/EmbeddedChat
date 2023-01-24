/* eslint-disable react/prop-types */
import { Button, PasswordInput, Box, Tile, Flex } from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUserStore, useTotpStore } from '../../store';

export default function TotpModal({ handleLogin }) {
  const [accessCode, setAccessCode] = useState(null);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );
  const isModalOpen = useTotpStore((state) => state.isModalOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(accessCode);
    setAccessCode(undefined);
  };

  const handleEdit = (e) => {
    setAccessCode(e.target.value);
  };
  return isModalOpen ? (
    <Box
      zIndex="2"
      textAlign="center"
      position="absolute"
      display="inline-block"
      pi="x250"
    >
      <Flex.Container wrap="wrap" alignContent="end">
        <Tile elevation="2" margin={25}>
          <form onSubmit={handleSubmit}>
            <Box>Enter TOTP</Box>
            <PasswordInput onChange={handleEdit} placeholder={123456} />
            <Button onClick={handleSubmit} primary>
              Submit
            </Button>
          </form>
        </Tile>
      </Flex.Container>
    </Box>
  ) : null;
}

TotpModal.prototype = {
  handleLogin: PropTypes.func,
};
