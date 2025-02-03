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
          max-width: 250px;
          margin: 0 auto;
        }

        @media (max-width: 420px) {
          max-width: 280px;
          margin: 0 auto;
        }
        @media (min-width: 481px) and (max-width: 600px) {
          width: ;
        }

        audio {
          width: 100%;
          max-width: 100%;
          @media (max-width: 600px) {
            max-width: 80%;
          }
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
