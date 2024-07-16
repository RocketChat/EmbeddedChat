import { css } from "@emotion/react";

export const getChatLayoutStyles = () => {
  const styles = {
    layout: css`
      flex-basis: 100%;
      display: flex;
      overflow: hidden;
    `,

    chatMain: css`
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      position: relative;
    `,
  };

  return styles;
};
