import React from 'react';
import { Icon } from '@rocket.chat/fuselage';
import PropTypes from 'prop-types';
import { Box } from '../../../Box';

function PreviewDefault({ data }) {
  return (
    <Box>
      <p>
        <Icon name="file" size="x20" />
        <span>{data.name}</span>
      </p>
    </Box>
  );
}

export default PreviewDefault;

PreviewDefault.propTypes = {
  data: PropTypes.object,
};
