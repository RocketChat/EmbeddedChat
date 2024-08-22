import { css } from '@emotion/react';
import { useTheme } from '../../hooks';

export const useMessageGenericPreviewStyles = () => {
  const { theme } = useTheme();

  const container = css`
    display: flex;
    overflow: hidden;
    flex-direction: column;
    padding: 0.75rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius};
    background-color: ${theme.colors.background};
  `;

  return { container };
};
