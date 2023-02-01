import React from 'react';
import './Markdown.css';
import { Box } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';
import { Markup } from '../Markup/index';

const Markdown = ({ body }) => (
  <Box>
    <Markup tokens={body.md} />
  </Box>
);

export default Markdown;

Markdown.propTypes = {
  body: PropTypes.any,
};
