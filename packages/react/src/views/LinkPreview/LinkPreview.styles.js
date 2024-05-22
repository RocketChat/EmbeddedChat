import { css, useTheme } from '@emotion/react';
import { useThemeStore } from '../../store';

const useLinkPreviewStyles = () => {
  const theme = useTheme();
  const mode = useThemeStore((state) => state.mode);
  const colors = theme.schemes[mode];

  const arrowDropDown = css`
    cursor: pointer;
    display: flex;
    align-items: center;
  `;

  const linkPreviewContainer = css`
    max-width: 22rem;
    border: 1px solid ${colors.border};
    border-radius: 0.25rem;
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
