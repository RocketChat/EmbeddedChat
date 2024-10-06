import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Icon } from '@embeddedchat/ui-elements';

function PreviewDefault({ data }) {
  return (
    <Box>
      <Box
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <Icon name="file" size="2.25rem" />
        <Box
          css={css`
            font-size: 16px;
          `}
        >
          {data.name}
        </Box>
      </Box>
    </Box>
  );
}

export default PreviewDefault;

PreviewDefault.propTypes = {
  data: PropTypes.object,
};
