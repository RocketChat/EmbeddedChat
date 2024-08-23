import { css } from '@emotion/react';

export const getSidebarStyles = (theme) => {
  const styles = {
    sidebarContainer: css`
      min-width: 350px;
      height: 100%;
      box-shadow: ${theme.shadows[2]};
      z-index: ${theme.zIndex?.sidebar || 1200};
      display: flex;
      flex-direction: column;
    `,
  };

  return styles;
};

export const getSidebarContentStyles = (theme) => {
  const styles = {
    content: css`
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: auto;
      overflow-x: hidden;
    `,

    searchContainer: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid ${theme.colors.border};
      padding: 0 0.5rem;
      border-radius: ${theme.radius};
      position: relative;
      margin: 0 1rem 1rem;
      &.focused {
        outline: 1px solid ${theme.colors.ring};
      }
    `,

    textInput: css`
      border: none;
      flex: 1;
      padding: none;
      &:focus {
        outline: none;
      }
    `,

    noInfoIcon: css`
      padding: 0.125em;
      cursor: pointer;
    `,
  };

  return styles;
};

export const SidebarHeaderStyles = {
  header: css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
  `,

  titleContainer: css`
    display: flex;
    align-items: center;
    flex: 1;
    gap: 0.5rem;
  `,

  icon: css`
    font-size: 1.25rem;
  `,
};
