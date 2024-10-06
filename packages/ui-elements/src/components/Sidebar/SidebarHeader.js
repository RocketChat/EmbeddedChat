import React from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import Heading from '../Heading/Heading';
import { SidebarHeaderStyles as styles } from './Sidebar.styles';
import { Avatar } from '../Avatar';

const SidebarHeader = ({ title, iconName, avatarUrl, onClose = () => {} }) => (
  <Box css={styles.header}>
    <Box css={styles.titleContainer}>
      {iconName && <Icon css={styles.icon} name={iconName} size="1.25rem" />}
      {avatarUrl && <Avatar url={avatarUrl} fallbackIcon="" size="1.75rem" />}
      <Heading level={3} style={{ display: 'contents' }}>
        {title}
      </Heading>
    </Box>
    <ActionButton onClick={onClose} ghost size="small">
      <Icon name="cross" />
    </ActionButton>
  </Box>
);

export default SidebarHeader;
