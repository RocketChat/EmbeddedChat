import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@embeddedchat/ui-elements';
import { useHighlightTextStyles as styles } from './elements.styles';

const HighlightText = ({ contents }) => {
  return (
    <Box
      is="span"
      css={styles.highlight}
    >
      {contents}
    </Box>
  );
};

HighlightText.propTypes = {
  contents: PropTypes.object.isRequired,
};

export default HighlightText;
