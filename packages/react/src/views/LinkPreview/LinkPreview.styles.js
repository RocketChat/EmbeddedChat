import { css } from '@emotion/react';
import { useTheme } from '@embeddedchat/ui-elements';

const useLinkPreviewStyles = () => {
  const { theme } = useTheme();
  const arrowDropDown = css`
    cursor: pointer;
    display: flex;
    align-items: center;
  `;

  const linkPreviewContainer = css`
    max-width: 16rem;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radius};
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
