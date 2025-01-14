import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@embeddedchat/ui-elements';
import { useHighlightTextStyles as styles } from './elements.styles';

const HighlightText = ({ contents }) => (
  <Box is="span" css={styles.highlight}>
    {contents}
  </Box>
);

HighlightText.propTypes = {
  contents: PropTypes.string.isRequired,
};

export default HighlightText;
