import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useListBoxStyles = () => {
  const { colors } = useCustomTheme();
  const main = css`
    overflow: auto;
    overflow-x: hidden;
    max-height: 145px;
    border: 1px solid ${colors.border};
    border-radius: 0.2rem;
    color: ${colors.secondaryForeground};
  `;

  const listItem = css`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25rem;

    &:hover {
      background-color: ${colors.secondary};
    }
  `;

  const listText = css`
    font-weight: 600;
  `;

  return { main, listItem, listText };
};

export default useListBoxStyles;
