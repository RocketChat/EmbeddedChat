import React from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { Input } from '../Input';
import Heading from '../Heading/Heading';
import styles from './Sidebar.styles';

const Sidebar = ({ title, iconName, setShowWindow, children, searchProps }) => {
  const {
    isSearch = false,
    handleInputChange,
    placeholder,
  } = searchProps || {};

  return (
    <Box css={styles.parent} className="ec-sidebar">
      <Box css={styles.container}>
        <Box css={styles.header}>
          <Heading level={3} style={{ display: 'contents' }}>
            <Icon css={styles.icon} name={iconName} size="1.25rem" />
            <Box css={styles.title}>{title}</Box>
            <ActionButton
              onClick={() => setShowWindow(false)}
              ghost
              size="small"
            >
              <Icon name="cross" />
            </ActionButton>
          </Heading>
        </Box>
        {isSearch && (
          <Box
            css={styles.searchContainer}
            style={{
              border: '2px solid #ddd',
              position: 'relative',
              marginBottom: '1rem',
            }}
          >
            <Input
              placeholder={placeholder}
              onChange={handleInputChange}
              css={styles.textInput}
            />

            <Icon name="magnifier" size="1.25rem" css={styles.noInfoIcon} />
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
