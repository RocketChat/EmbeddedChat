import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useSidebarStyles = () => {
  const { theme, colors } = useCustomTheme();

  const sidebarContainer = css`
    width: 350px;
    height: 100%;
    box-shadow: ${theme.shadows[2]};
    z-index: ${theme.zIndex.general};
    display: flex;
    flex-direction: column;
  `;

  const content = css`
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    overflow-x: hidden;
  `;

  const header = css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.5rem;
  `;

  const title = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
  `;

  const icon = css`
    font-size: 1.25rem;
  `;

  const searchContainer = css`
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid ${colors.border};
    border-radius: ${theme.schemes.radius};
    position: relative;
    margin: 0 1rem 1rem;
    &.focused {
      outline: 1px solid ${colors.ring};
    }
  `;

  const textInput = css`
    border: none;
    flex: none;
    padding: none;
    &:focus {
      outline: none;
    }
  `;

  const noInfoIcon = css`
    padding: 0.125em;
    cursor: pointer;
  `;

  const titleContainer = css`
    display: flex;
    align-items: center;
    flex: 1;
    gap: 0.5rem;
  `;

  return {
    sidebarContainer,
    content,
    header,
    title,
    icon,
    searchContainer,
    textInput,
    noInfoIcon,
    titleContainer,
  };
};

export default useSidebarStyles;
