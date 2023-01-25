import React from 'react';
import './Markdown.css';
import { Box } from '@rocket.chat/fuselage';
import EmojiOne from 'emoji-toolkit';
import PropTypes from 'prop-types';
import { Markup } from '../Markup/index';

function emojify(message) {
  return EmojiOne.toImage(message);
}

const Markdown = ({ body }) => (
  <Box>
    <Markup tokens={body.md} />
  </Box>
);

export default Markdown;

Markdown.propTypes = {
  body: PropTypes.any,
};
