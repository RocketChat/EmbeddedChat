import { Box } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';
import React from 'react';

const Home = ({ height }) => {
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
      <p style={{ marginTop: '1rem' }}>
        To enable anonymous mode, Go to -&gt;{' '}
        <code>Admin -&gt; Accounts -&gt; Allow Anonymous Read</code>. This will
        allow users to see the chat without logging in.
      </p>
    </Box>
  );
};

export default Home;

Home.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
