import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@embeddedchat/ui-elements';
import { useCustomTheme } from '../../../hooks/useCustomTheme';

function PreviewImage({ previewURL }) {
  const { theme } = useCustomTheme();
  return (
    <Box>
      <img
        src={previewURL}
        style={{
          maxWidth: '90%',
          objectFit: 'contain',
          borderRadius: theme.schemes.radius,
        }}
      />
    </Box>
  );
}

export default PreviewImage;

PreviewImage.propTypes = {
  previewURL: PropTypes.string,
};
