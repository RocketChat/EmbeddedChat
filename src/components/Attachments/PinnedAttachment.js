import React from 'react';
import { Box } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';

const PinnedAttachment = ({ attachment }) => (
  <Box borderInlineStart="1px solid currentColor" p="x16">
    <Box withTruncatedText fontScale="p2m" mi={2}>
      {attachment?.author_name}
    </Box>
    <Box mbe={4} mi={2} fontScale="p2" color="default">
      {attachment?.text}
    </Box>
  </Box>
);

export default PinnedAttachment;

PinnedAttachment.propTypes = {
  attachment: PropTypes.object,
};
