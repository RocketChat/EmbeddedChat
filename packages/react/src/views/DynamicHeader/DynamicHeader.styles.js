import { css, useTheme } from '@emotion/react';

const useDynamicHeaderStyles = () => {
  const theme = useTheme();

  const container = css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    z-index: ${theme.zIndex.general};
    padding-block-start: 10px;
  `;

  const clearSpacing = css`
    margin: 0;
    padding: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  `;
  return { container, clearSpacing };
};

export default useDynamicHeaderStyles;
