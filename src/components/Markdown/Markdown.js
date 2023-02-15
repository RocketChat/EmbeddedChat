import React from 'react';
import './Markdown.css';
import { Box, MessageEmoji } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';
import emojione from 'emoji-toolkit';
import { Markup } from '../Markup/index';

const Markdown = ({ body, isReaction = false, members }) => {
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
      <Markup tokens={body.md} members={members} />
    </Box>
  );
};
export default Markdown;

Markdown.propTypes = {
  body: PropTypes.any,
  isReaction: PropTypes.bool,
  members: PropTypes.any,
};
