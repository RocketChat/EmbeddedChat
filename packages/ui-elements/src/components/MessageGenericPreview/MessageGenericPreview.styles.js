import { css } from '@emotion/react';
import { useTheme } from '../../hooks';

export const useMessageGenericPreviewStyles = () => {
  const { theme, colors } = useTheme();

  const container = css`
    display: flex;
    overflow: hidden;
    flex-direction: column;
    padding: 0.75rem;
    border: 1px solid ${colors.border};
    border-radius: ${theme.schemes.radius};
    background-color: ${colors.background};
  `;

  return { container };
};
