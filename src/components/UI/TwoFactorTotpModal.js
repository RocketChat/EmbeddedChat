/* eslint-disable react/prop-types */
import { Button, PasswordInput, Box, Tile } from '@rocket.chat/fuselage';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUserStore } from '../../store';

export default function TotpModal({ handleLogin }) {
  const [accessCode, setAccessCode] = useState(null);
  const isUserAuthenticated = useUserStore(
    (state) => state.isUserAuthenticated
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(accessCode);
    setAccessCode(undefined);
  };

  const handleEdit = (e) => {
    setAccessCode(e.target.value);
  };
  return !isUserAuthenticated ? (
    <Box
      zIndex="2"
      textAlign="center"
      position="absolute"
      display="inline-block"
      pi="x500"
    >
      <Tile elevation="2" margin={25}>
        <form onSubmit={handleSubmit}>
          <Box>Enter TOTP</Box>
          <PasswordInput onChange={handleEdit} placeholder={123456} />
          <Button onClick={handleSubmit} primary>
            Submit
          </Button>
        </form>
      </Tile>
    </Box>
  ) : null;
}

TotpModal.prototype = {
  handleLogin: PropTypes.func,
};
