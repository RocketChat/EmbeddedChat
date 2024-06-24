import React, { useRef } from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { Input } from '../Input';
import useSidebarStyles from './Sidebar.styles';

const SidebarContent = ({ children, searchProps = {}, style }) => {
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

  return (
    <Box css={styles.content} style={style}>
      {isSearch && (
        <Box
          css={styles.searchContainer}
          style={{
            position: 'relative',
            margin: '0.5rem',
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
  );
};

export default SidebarContent;
