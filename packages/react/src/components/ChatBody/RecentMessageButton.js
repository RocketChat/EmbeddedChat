import React, { useState } from 'react';
import { css } from '@emotion/react';
import { Button } from '../Button';
import { Icon } from '../Icon';

const buttonStyle = css`
  position: relative;
  z-index: 90;
  left: 50%;
  transform: translateX(-50%);
  user-select: none;
  opacity: 0;
  overflow: visible;
  animation: fadeInAndMoveUp 1s ease-in-out forwards;

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
`;

const textAndIconContainer = css`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 200;
`;

const RecentMessageButton = ({ visible, onClick, text }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <Button
      css={[buttonStyle, !visible && 'not', clicked && 'clicked']}
      color="primary"
      size="small"
      onClick={() => {
        onClick();
        setClicked(true);
      }}
      style={{
        cursor: 'pointer',
        borderRadius: '20px',
      }}
    >
      <div css={textAndIconContainer}>
        {text}
        <Icon name="arrow-down" size={16} />
      </div>
    </Button>
  );
};

export default RecentMessageButton;
