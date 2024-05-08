import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';

const container = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  z-index: 100;
`;

const nospace = css`
  margin: 0;
  padding: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const DynamicHeader = ({
  title,
  isHeaderIcon = false,
  handleClose = () => {},
  iconName,
  headerIconName,
}) => (
  <Box
    css={container}
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

      <h4 css={nospace}>{title}</h4>
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
