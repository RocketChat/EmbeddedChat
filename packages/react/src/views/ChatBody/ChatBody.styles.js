import { css } from '@emotion/react';

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

export const getRecentMessageStyles = () => {
  const styles = {
    button: css`
      position: relative;
      z-index: 1100;
      left: 50%;
      transform: translateX(-50%);
      user-select: none;
      opacity: 0;
      overflow: visible;
      animation: fadeInAndMoveUp 1s ease-in-out forwards;
      cursor: pointer;

      &.not {
        visibility: hidden;
      }

      &.clicked {
        animation: fadeOutAndMoveUp 1s ease-in-out forwards;
      }

      @keyframes fadeInAndMoveUp {
        from {
          opacity: 0;
          transform: translateY(20px) translateX(-50%);
        }
        to {
          opacity: 1;
          transform: translateY(0) translateX(-50%);
        }
      }

      @keyframes fadeOutAndMoveUp {
        50% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translateY(-20px) translateX(-50%);
          visibility: hidden;
        }
      }
    `,

    textIconContainer: css`
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 200;
    `,
  };

  return styles;
};
