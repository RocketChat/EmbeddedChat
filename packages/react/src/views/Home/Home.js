import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';
import { Box, Heading } from '@embeddedchat/ui-elements';
import styles from './Home.styles';

const Home = ({ height }) => (
  <Box
    css={css`
      height: ${height};
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    `}
  >
    <Heading level={3} style={{ display: 'inline' }}>
      EmbeddedChat | Home
    </Heading>
    <p>
      For more documentation visit:{' '}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://github.com/RocketChat/EmbeddedChat#README"
      >
        README
      </a>
    </p>
    <p css={styles.paraText}>
      To enable anonymous mode pass in{' '}
      <strong>anonymousMode prop as true</strong> and, then
    </p>
    <p css={styles.paraText}>
      Enable Anonymous read by going to -&gt;{' '}
      <code>Admin -&gt; Accounts -&gt; Allow Anonymous Read</code>. This will
      allow users to see the chat without logging in.
    </p>
  </Box>
);

export default Home;

Home.propTypes = {
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
