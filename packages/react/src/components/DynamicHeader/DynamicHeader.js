import React from 'react';
import PropTypes from 'prop-types';
import styles from './DynamicHeader.module.css';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';

const DynamicHeader = ({
  title,
  isHeaderIcon = false,
  handleClose = () => {},
  iconName,
  headerIconName,
}) => (
  <Box
    className={styles.container}
    style={{
      paddingBlockStart: '10px',
    }}
  >
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: '0.5rem',
      }}
    >
      <ActionButton
        onClick={handleClose}
        ghost
        display="inline"
        square
        size="small"
      >
        <Icon name={iconName} size="1.25rem" />
      </ActionButton>

      <h4 className={styles.nospace}>{title}</h4>
      {isHeaderIcon && <Icon name={headerIconName} size="1.25rem" />}
    </Box>
  </Box>
);

export default DynamicHeader;

DynamicHeader.propTypes = {
  handleClose: PropTypes.func,
  title: PropTypes.string,
  isHeaderIcon: PropTypes.bool,
  iconName: PropTypes.string,
};
