import { css } from '@emotion/react';
import { useTheme } from '../../hooks/useTheme';

const useListBoxStyles = () => {
  const { colors } = useTheme();
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
    padding: 0.2rem;

    &:hover {
      background-color: ${colors.secondary};
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
