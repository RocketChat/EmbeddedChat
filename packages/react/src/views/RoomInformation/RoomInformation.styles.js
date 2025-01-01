import { css } from '@emotion/react';

const getRoomInformationStyles = () => {
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
    `,
  };

  return styles;
};

export default getRoomInformationStyles;
