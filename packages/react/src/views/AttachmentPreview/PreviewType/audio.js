import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@embeddedchat/ui-elements';
import { css } from '@emotion/react';

function PreviewAudio({ previewURL }) {
  return (
    <Box
      css={css`
        width: 100%;

        @media (max-width: 320px) {
          max-width: 270px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          max-width: 300px;
          margin: 0 auto;
        }

        audio {
          width: 100%;
          max-width: 100%;
        }
      `}
    >
      <audio src={previewURL} controls />
    </Box>
  );
}

export default PreviewAudio;

PreviewAudio.propTypes = {
  previewURL: PropTypes.string,
};
