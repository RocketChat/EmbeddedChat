import { css } from "@emotion/react";

export const getChatbodyStyles = () => {
  const styles = {
    chatbodyContainer: css`
      flex: 1;
      word-break: break-all;
      overflow: auto;
      overflow-x: hidden;
      display: flex;
      flex-direction: column-reverse;
      max-height: 600px;
      position: relative;
      padding-top: 70px;
      margin-top: 0.25rem;
    `,
  };

  return styles;
};
