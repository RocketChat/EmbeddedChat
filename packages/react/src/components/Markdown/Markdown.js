import React from 'react';
import './Markdown.css';
import { MessageEmoji } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';
import emojione from 'emoji-toolkit';
import { Markup } from '../Markup/index';
import { Box } from '../Box';

const Markdown = ({ body, isReaction = false }) => {
  if (isReaction) {
    return (
      <MessageEmoji>
        <Box
          dangerouslySetInnerHTML={{
            __html: emojione.toImage(body),
          }}
        />
      </MessageEmoji>
    );
  }

  if (!body || !body.md) return <></>;

  return (
    <Box>
      <Markup tokens={body.md} />
    </Box>
  );
};
export default Markdown;

Markdown.propTypes = {
  body: PropTypes.any,
  isReaction: PropTypes.bool,
};
