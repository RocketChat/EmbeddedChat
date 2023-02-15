import React from 'react';
import './Markdown.css';
import { Box } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';
import { Markup } from '../Markup/index';

const Markdown = ({ body, members }) => (
  <Box>
    <Markup tokens={body.md} members={members} />
  </Box>
);
export default Markdown;

Markdown.propTypes = {
  body: PropTypes.any,
  members: PropTypes.any,
};
