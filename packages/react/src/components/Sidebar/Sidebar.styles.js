import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';

const useSidebarStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const parent = css`
    width: 350px;
    height: 100%;
    box-shadow: ${theme.shadows[2]};
    z-index: ${theme.zIndex.general};
  `;

  const container = css`
    display: flex;
    flex-direction: column;
    height: 100%;
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
    width: 80%;
  `;

  const icon = css`
    font-size: 1.25rem;
    padding: 0 0.5rem 0.5rem 0;
  `;

  const searchContainer = css`
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid ${colors.border};
    border-radius: ${theme.schemes.radius};
    position: relative;
    margin: 0 1rem 1rem;
  `;

  const textInput = css`
    border: none;
    flex: none;
    padding: none;
    &:focus {
      border: none;
      box-shadow: none;
      outline: none;
    }
  `;

  const noInfoIcon = css`
    padding: 0.125em;
    cursor: pointer;
  `;

  return {
    parent,
    container,
    header,
    title,
    icon,
    searchContainer,
    textInput,
    noInfoIcon,
  };
};

export default useSidebarStyles;
