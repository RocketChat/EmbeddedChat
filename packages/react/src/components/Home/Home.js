import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '../Box';
import styles from './Home.module.css';

// Define Emotion.sh styles for the component
const componentStyles = {
  container: css`
    height: ${height};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  paraText: css`
    margin-top: 1rem;
    font-size: 1rem;

    @media (max-width: 768px) {
      margin-top: 0.5rem;
      font-size: 0.775rem;
      line-height: 1rem;
    }

    > code {
      font-size: inherit;
    }
  `,
};

const Home = ({ height }) => (
  <Box css={componentStyles.container}>
    <h2 style={{ display: 'inline' }}>EmbeddedChat | Home</h2>
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
    <p css={componentStyles.paraText}>
      To enable anonymous mode pass in{' '}
      <strong>anonymousMode prop as true</strong> and, then
    </p>
    <p css={componentStyles.paraText}>
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
