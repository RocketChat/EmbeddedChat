import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../Box';

const PinnedAttachment = ({ attachment }) => (
  <Box
    style={{
      borderInlineStart: '1px solid currentColor',
    }}
  >
    <Box>{attachment?.author_name}</Box>
    <Box>{attachment?.text}</Box>
  </Box>
);

export default PinnedAttachment;

PinnedAttachment.propTypes = {
  attachment: PropTypes.object,
};
