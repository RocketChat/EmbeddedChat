import { css } from '@emotion/react';
import { useCustomTheme } from '../../hooks/useCustomTheme';

const useLinkPreviewStyles = () => {
  const { theme, colors } = useCustomTheme();
  const arrowDropDown = css`
    cursor: pointer;
    display: flex;
    align-items: center;
  `;

  const linkPreviewContainer = css`
    max-width: 16rem;
    border: 1px solid ${colors.border};
    border-radius: ${theme.schemes.radius};
    margin-bottom: 0.75rem;
    overflow: hidden;
  `;

  const textStyle = css`
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-block-start: 0rem;
    margin-block-end: 0rem;
  `;

  return { arrowDropDown, linkPreviewContainer, textStyle };
};

export default useLinkPreviewStyles;
