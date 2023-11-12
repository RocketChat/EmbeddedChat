import { css } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';
import { Box } from '../Box';

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
    <p
      css={css`
        margin-top: 1rem;
        font-size: 1rem;

        @media (max-width: 768px) {
          margin-top: 0.5rem;
          font-size: 0.775rem;
          line-height: 1rem;

          > code {
            font-size: inherit;
          }
        }
      `}
    >
      To enable anonymous mode pass in{' '}
      <strong>anonymousMode prop as true</strong> and, then
    </p>
    <p
      css={css`
        margin-top: 1rem;
        font-size: 1rem;

        @media (max-width: 768px) {
          margin-top: 0.5rem;
          font-size: 0.775rem;
          line-height: 1rem;

          > code {
            font-size: inherit;
          }
        }
      `}
    >
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
