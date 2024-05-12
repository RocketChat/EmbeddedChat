import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';
import styles from './DynamicHeader.styles';

const DynamicHeader = ({
  title,
  isHeaderIcon = false,
  handleClose = () => {},
  iconName,
  headerIconName,
}) => (
  <Box css={styles.container}>
    <Box
      css={css`
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 0.5rem;
      `}
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

      <h4 css={styles.clearSpacing}>{title}</h4>
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
