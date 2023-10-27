import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react'; // Import Emotion's css function
import { Markup } from '../Markup/index';
import { Box } from '../Box';
import MessageEmoji from '../MessageEmoji/MessageEmoji';
import {} from './Markdown.css';

const Markdown = ({ body, isReaction = false }) => {
  if (isReaction) {
    const containerStyle = css`
      font-size: 1rem; // Adjust the size as needed
    `;

    return (
      <div css={containerStyle}>
        <MessageEmoji body={body} />
      </div>
    );
  }

  if (!body || !body.md) return <></>;

  return (
    <Box>
      <Markup tokens={body.md} />
    </Box>
  );
};

Markdown.propTypes = {
  body: PropTypes.any,
  isReaction: PropTypes.bool,
};

export default Markdown;
