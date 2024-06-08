import React, { useRef } from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { Input } from '../Input';
import Heading from '../Heading/Heading';
import useSidebarStyles from './Sidebar.styles';
import useSetExclusiveState from '../../hooks/useSetExclusiveState';

const Sidebar = ({ title, iconName, children, searchProps = {} }) => {
  const {
    isSearch = false,
    handleInputChange,
    placeholder,
  } = searchProps || {};
  const styles = useSidebarStyles();
  const searchContainerRef = useRef(null);

  const handleFocus = () => {
    if (searchContainerRef.current) {
      searchContainerRef.current.classList.add('focused');
    }
  };

  const handleBlur = () => {
    if (searchContainerRef.current) {
      searchContainerRef.current.classList.remove('focused');
    }
  };

  const setExclusiveState = useSetExclusiveState();

  return (
    <Box css={styles.parent} className="ec-sidebar">
      <Box css={styles.container}>
        <Box css={styles.header}>
          <Box css={styles.titleContainer}>
            <Icon css={styles.icon} name={iconName} size="1.25rem" />
            <Heading level={3} style={{ display: 'contents' }}>
              {title}
            </Heading>
          </Box>
          <ActionButton
            onClick={() => setExclusiveState(null)}
            ghost
            size="small"
          >
            <Icon name="cross" />
          </ActionButton>
        </Box>
        {isSearch && (
          <Box
            css={styles.searchContainer}
            style={{
              position: 'relative',
              marginBottom: '1rem',
            }}
            ref={searchContainerRef}
          >
            <Input
              placeholder={placeholder}
              onChange={handleInputChange}
              css={styles.textInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
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
