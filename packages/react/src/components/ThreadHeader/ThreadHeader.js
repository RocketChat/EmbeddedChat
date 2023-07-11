import { ActionButton, Box, Icon } from '@rocket.chat/fuselage';
import React from 'react';
import PropTypes from 'prop-types';
import styles from './ThreadHeader.module.css';
import { isDark } from '../../lib/color';

const ThreadHeader = ({ headerColor = '#fff', title, handleClose }) => {
  const computedHeaderTextColor = isDark(headerColor) ? 'white' : 'black';
  const computedHeaderBackgroundColor = headerColor;

  return (
    <Box
      className={styles.container}
      paddingBlockStart={10}
      backgroundColor={computedHeaderBackgroundColor}
    >
      <Box display="flex" alignItems="center">
        <ActionButton onClick={handleClose} ghost display="inline" square small>
          <Icon color={computedHeaderTextColor} name="arrow-back" size="x20" />
        </ActionButton>
        <h4
          className={styles.nospace}
          style={{ color: computedHeaderTextColor }}
        >
          {title}
        </h4>
      </Box>
    </Box>
  );
};

export default ThreadHeader;

ThreadHeader.propTypes = {
  headerColor: PropTypes.string,
  handleClose: PropTypes.func,
  title: PropTypes.string,
};
