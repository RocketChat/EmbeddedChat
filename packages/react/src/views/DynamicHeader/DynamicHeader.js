import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/react';
import { Box, Icon, ActionButton, Heading } from '@embeddedchat/ui-elements';
import useDynamicHeaderStyles from './DynamicHeader.styles';

const DynamicHeader = ({
  title,
  isHeaderIcon = false,
  handleClose = () => {},
  iconName,
  headerIconName,
}) => {
  const styles = useDynamicHeaderStyles();
  return (
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

        <Heading level={6} css={styles.clearSpacing}>
          {title}
        </Heading>
        {isHeaderIcon && <Icon name={headerIconName} size="1.25rem" />}
      </Box>
    </Box>
  );
};

export default DynamicHeader;

DynamicHeader.propTypes = {
  handleClose: PropTypes.func,
  title: PropTypes.string,
  isHeaderIcon: PropTypes.bool,
  iconName: PropTypes.string,
};
