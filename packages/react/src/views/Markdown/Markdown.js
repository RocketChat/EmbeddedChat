import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box } from '@embeddedchat/ui-elements';
import { Markup } from '../Markup/index';
import EmojiReaction from '../EmojiReaction/EmojiReaction';

const Markdown = ({ body, isReaction = false }) => {
  if (isReaction) {
    return (
      <Box
        css={css`
          font-size: 1rem;
        `}
      >
        <EmojiReaction body={body} />
      </Box>
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
