import React from 'react';
import PropTypes from 'prop-types';
import { dropBoxStyles as styles } from './DropBox.styles';
import { Box } from '../Box';

const DropBox = ({ fullScreen = false, height, children }) => (
  <Box
    css={[styles.dropBox, styles.border]}
    style={{ height: !fullScreen ? height : '90vh' }}
  >
    {children}
  </Box>
);

DropBox.propTypes = {
  fullScreen: PropTypes.bool,
  height: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default DropBox;
