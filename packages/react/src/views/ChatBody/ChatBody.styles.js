import { css } from '@emotion/react';

export const chatbodyStyles = {
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
    ::-webkit-scrollbar {
      width: 4px;
      height: 7.7px;
    }
    ::-webkit-scrollbar-thumb {
      background: #8d8d8d;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    ::-webkit-scrollbar-button {
      display: none;
    }
  `,
};

export const recentMessageStyles = {
  button: css`
    position: relative;
    z-index: 90;
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
