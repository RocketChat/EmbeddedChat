import React from 'react';
import PropTypes from 'prop-types';
import styles from './DynamicHeader.module.css';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';

const DynamicHeader = ({ title, isClosable = false, handleClose = () => { }, iconName }) => {
  return (
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
        {isClosable && (
          <ActionButton onClick={handleClose} ghost display="inline" square small>
            <Icon name={iconName} size="1.25rem" />
          </ActionButton>
        )}
        {!isClosable && (
          <div>
            <Icon name={iconName} size="1.25rem" />
          </div>
        )}
        <h4 className={styles.nospace}>{title}</h4>
      </Box>
    </Box>
  );
};

export default DynamicHeader;

DynamicHeader.propTypes = {
  handleClose: PropTypes.func,
  title: PropTypes.string,
  isClosable: PropTypes.bool,
  iconName: PropTypes.string,
};
