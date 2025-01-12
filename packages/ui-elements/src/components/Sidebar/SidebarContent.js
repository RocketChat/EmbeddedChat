import React, { useRef } from 'react';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { getSidebarContentStyles } from './Sidebar.styles';
import { useTheme } from '../../hooks';
import { StaticSelect } from '../StaticSelect';

const SidebarContent = ({
  children,
  searchProps = {},
  style,
  filterProps = {},
}) => {
  const {
    isSearch = false,
    handleInputChange,
    placeholder,
  } = searchProps || {};
  const { isFile, options, value, handleFilterSelect } = filterProps || {};
  const searchContainerRef = useRef(null);
  const { theme } = useTheme();
  const styles = getSidebarContentStyles(theme);

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
      <Box css={styles.filesHeader}>
        {isSearch && (
          <Box
            css={styles.searchContainer}
            style={{
              position: 'relative',
              marginBottom: '0.5rem',
              width: isFile ? '60%' : '100%',
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
        {isFile && (
          <Box>
            <StaticSelect
              style={{
                position: 'relative',
                marginBottom: '0.5rem',
              }}
              isFile={isFile}
              options={options}
              value={value}
              onSelect={handleFilterSelect}
            />
          </Box>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default SidebarContent;
