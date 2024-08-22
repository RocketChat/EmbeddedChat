import { css } from '@emotion/react';
import useTheme from '../../hooks/useTheme';

const useListBoxStyles = () => {
  const { theme } = useTheme();
  const main = css`
    overflow: auto;
    overflow-x: hidden;
    max-height: 145px;
    border: 1px solid ${theme.colors.border};
    border-radius: 0.2rem;
    color: ${theme.colors.secondaryForeground};
  `;

  const listItem = css`
    cursor: pointer;
    display: flex;theme.
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem;

    &:hover {
      background-color: ${theme.colors.secondary};
    }
  `;

  const listText = css`
    font-weight: 600;
  `;

  const checkContainer = css`
    padding: 0.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const checkbox = css`
    cursor: pointer;
  `;

  return { main, listItem, listText, checkContainer, checkbox };
};

export default useListBoxStyles;
