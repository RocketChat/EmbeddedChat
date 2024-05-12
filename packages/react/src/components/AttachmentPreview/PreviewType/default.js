import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '../../Box';
import { Icon } from '../../Icon';

function PreviewDefault({ data }) {
  return (
    <Box>
      <p>
        <Icon name="file" size="1.25rem" />
        <Box is="span">{data.name}</Box>
      </p>
    </Box>
  );
}

export default PreviewDefault;

PreviewDefault.propTypes = {
  data: PropTypes.object,
};
