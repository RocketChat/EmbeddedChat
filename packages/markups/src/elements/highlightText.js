import React from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme } from '@embeddedchat/ui-elements';
import { useHighlightTextStyles } from './elements.styles';

const HighlightText = ({ contents }) => {
  const { theme } = useTheme();
  const { mode } = useTheme();
  const styles = useHighlightTextStyles(theme, mode);

  return (
    <Box is="span" css={styles.highlight}>
      {contents}{' '}
    </Box>
  );
};

HighlightText.propTypes = {
  contents: PropTypes.string.isRequired,
};

export default HighlightText;
