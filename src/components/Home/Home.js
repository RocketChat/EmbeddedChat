import { Box, Button, Icon } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useGoogleLogin } from '../../hooks/useGoogleLogin';
import RCContext from '../../context/RCInstance';
import { useMessageStore, useUserStore } from '../../store';
import { useToastBarDispatch } from '@rocket.chat/fuselage-toastbar';

const Home = ({ height, GOOGLE_CLIENT_ID }) => {
  const { signIn } = useGoogleLogin(GOOGLE_CLIENT_ID);
  const { RCInstance } = useContext(RCContext);

  const setIsUserAuthenticated = useUserStore(
    (state) => state.setIsUserAuthenticated
  );

  const dispatchToastMessage = useToastBarDispatch();

  const setMessages = useMessageStore((state) => state.setMessages);

  const handleLogin = async () => {
    await RCInstance.googleSSOLogin(signIn);
    const { messages } = await RCInstance.getMessages();
    setMessages(messages);
    setIsUserAuthenticated(true);
    dispatchToastMessage({
      type: 'success',
      message: 'Successfully logged in',
    });
  };
  return (
    <Box
      height={height}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <h2 style={{ display: 'inline' }}>EmbeddedChat | Home</h2>
      <p>
        For more documentation visit:{' '}
        <a
          target={'_blank'}
          rel="noreferrer"
          href="https://github.com/RocketChat/EmbeddedChat#README"
        >
          README
        </a>
      </p>
      <Button onClick={handleLogin} margin={'1rem'}>
        <Icon name="google" size="x20" />
        Sign In with Google
      </Button>
    </Box>
  );
};

export default Home;

Home.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  GOOGLE_CLIENT_ID: PropTypes.string,
};
