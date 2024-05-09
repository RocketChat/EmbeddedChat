import React from 'react';
import { css } from '@emotion/react';
import { Box } from '../Box';
import { Icon } from '../Icon';
import { ActionButton } from '../ActionButton';
import { Input } from '../Input';

const sidebarCSS = css`
  position: fixed;
  right: 0;
  top: 0;
  width: 370px;
  height: 100%;
  background-color: white;
  box-shadow: -1px 0px 5px rgb(0 0 0 / 25%);
  z-index: 100;
`;

const sidebarContainer = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const sidebarHeader = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
`;

const sidebarTitle = css`
  color: #4a4a4a;
  width: 80%;
`;

const sidebarIcon = css`
  font-size: 1.25rem;
  padding: 0 0.5rem 0.5rem 0;
`;

const searchContainerCss = css`
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #fff;
  border: 2px solid #ddd;
  border-radius: 0.25rem;
  position: relative;
  margin: 0 1rem 1rem;
`;

const textInputCss = css`
  border: none;
  flex: none;
  padding: none;
  &:focus {
    border: none;
    box-shadow: none;
  }
`;

const Sidebar = ({ title, iconName, setShowWindow, children, searchProps }) => {
  const {
    isSearch = false,
    handleInputChange,
    placeholder,
  } = searchProps || {};

  return (
    <Box css={sidebarCSS} className="ec-sidebar">
      <Box css={sidebarContainer}>
        <Box css={sidebarHeader}>
          <h3 style={{ display: 'contents' }}>
            <Icon css={sidebarIcon} name={iconName} size="1.25rem" />
            <Box css={sidebarTitle}>{title}</Box>
            <ActionButton
              onClick={() => setShowWindow(false)}
              ghost
              size="small"
            >
              <Icon name="cross" />
            </ActionButton>
          </h3>
        </Box>
        {isSearch && (
          <Box
            css={searchContainerCss}
            style={{
              border: '2px solid #ddd',
              position: 'relative',
              marginBottom: '1rem',
            }}
          >
            <Input
              placeholder={placeholder}
              onChange={handleInputChange}
              css={textInputCss}
            />

            <Icon
              name="magnifier"
              size="1.25rem"
              style={{ padding: '0.125em', cursor: 'pointer' }}
            />
          </Box>
        )}
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
