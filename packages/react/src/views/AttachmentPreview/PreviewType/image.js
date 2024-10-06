import React from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@embeddedchat/ui-elements';

function PreviewImage({ previewURL }) {
  const { theme } = useTheme();
  return (
    <Box>
      <img
        src={previewURL}
        style={{
          maxWidth: '90%',
          objectFit: 'contain',
          borderRadius: theme.radius,
        }}
      />
    </Box>
  );
}

export default PreviewImage;

PreviewImage.propTypes = {
  previewURL: PropTypes.string,
};
