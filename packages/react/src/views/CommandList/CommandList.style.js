import { css } from '@emotion/react';
import { useTheme } from '@embeddedchat/ui-elements';

const useCommandListStyles = () => {
  const { theme } = useTheme();
  const main = css`
    margin: 0.2rem 2rem;
    display: block;
    max-height: 10rem;
    overflow: scroll;
    overflow-x: hidden;
    max-height: 145px;
    border: 1px solid ${theme.colors.border};
    border-radius: 0.2rem;
    color: ${theme.colors.secondaryForeground};
  `;

  const listItem = css`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.1rem 0.25rem;

    &:hover {
      background-color: ${theme.colors.secondary};
    }
  `;

  const listText = css`
    font-weight: 600;
  `;

  return { main, listItem, listText };
};

export default useCommandListStyles;
