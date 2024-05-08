import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Markup } from '../Markup/index';
import { Box } from '../Box';
import {} from './Markdown.css';
import EmojiReaction from '../EmojiReaction/EmojiReaction';

const Markdown = ({ body, isReaction = false }) => {
  if (isReaction) {
    const containerStyle = css`
      font-size: 1rem;
    `;

    return (
      <div css={containerStyle}>
        <EmojiReaction body={body} />
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
