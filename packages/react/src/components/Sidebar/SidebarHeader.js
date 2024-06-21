import React from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import Heading from '../Heading/Heading';
import useSidebarStyles from './Sidebar.styles';

const SidebarHeader = ({ title, iconName, onClose = () => {} }) => {
  const styles = useSidebarStyles();

  return (
    <Box css={styles.header}>
      <Box css={styles.titleContainer}>
        {iconName && <Icon css={styles.icon} name={iconName} size="1.25rem" />}
        <Heading level={3} style={{ display: 'contents' }}>
          {title}
        </Heading>
      </Box>
      <ActionButton onClick={onClose} ghost size="small">
        <Icon name="cross" />
      </ActionButton>
    </Box>
  );
};

export default SidebarHeader;
