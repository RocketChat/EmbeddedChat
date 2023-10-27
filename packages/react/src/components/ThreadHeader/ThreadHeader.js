import { css } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon';
import { Box } from '../Box';
import { ActionButton } from '../ActionButton';

const styles = {
  container: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    z-index: 100;
    padding: 10px 0;
  `,
  nospace: css`
    margin: 0;
    padding: 0;
  `,
};

const ThreadHeader = ({ title, handleClose }) => (
  <Box
    css={styles.container}
    style={{
      paddingBlockStart: '10px',
    }}
  >
    <Box
      css={css`
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 0.5rem;
      `}
    >
      <ActionButton onClick={handleClose} ghost display="inline" square small>
        <Icon name="arrow-back" size="1.25rem" />
      </ActionButton>
      <h4 css={styles.nospace}>{title}</h4>
    </Box>
  </Box>
);

export default ThreadHeader;

ThreadHeader.propTypes = {
  handleClose: PropTypes.func,
  title: PropTypes.string,
};
