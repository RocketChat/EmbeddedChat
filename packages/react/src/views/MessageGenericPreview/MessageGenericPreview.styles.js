import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

export const useMessageGenericPreviewStyles = () => {
  const { colors } = useCustomTheme();

  const container = css`
    display: flex;
    overflow: hidden;
    flex-direction: column;
    padding: 0.75rem;
    border: 1px solid ${colors.border};
    border-radius: 5px;
    background-color: ${colors.background};
  `;

  return { container };
};
