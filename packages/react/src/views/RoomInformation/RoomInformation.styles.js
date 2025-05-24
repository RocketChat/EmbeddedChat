import { css } from '@emotion/react';

const getRoomInformationStyles = (theme, mode) => {
  const styles = {
    infoContainer: css`
      margin: 16px;
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
    `,
    infoHeader: css`
      margin-block: 5px;
      font-weight: 900;
    `,
    info: css`
      word-wrap: break-word;
      overflow-wrap: anywhere;
      white-space: normal;
      opacity: 0.7;
      font-size: 0.9rem;
    `,

    archivedRoomInfo: css`
      display: flex;
      border: 1px solid
        ${mode === 'light'
          ? theme.colors.warning
          : theme.colors.warningForeground};
      border-radius: ${theme.radius};
      padding: 0.75rem 1rem;
      width: 100%;
      gap: 0.75rem;
      margin-bottom: 1rem;
    `,
    archivedText: css`
      font-size: 1rem;
    `,
  };

  return styles;
};

export default getRoomInformationStyles;
