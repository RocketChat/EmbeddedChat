import React, { useState } from 'react';
import { Box } from '../Box';
import { Button } from '../Button';
import { css } from '@emotion/react';
import { Icon } from '../Icon';


const buttonStyle = css`
  position: relative;
  z-index: 90;
  left: 50%;
  transform: translateX(-50%);
  user-select: none;
  animation: fadeIn 0.5s ease-in-out;

  &.not {
    visibility: hidden;
  }

  &.clicked {
    animation: fadeOut 1s linear forwards, moveDown 1s linear forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      visibility: hidden;
    }
  }

  @keyframes moveDown {
    to {
      transform: translateY(50px); // Adjust the distance to move downward
    }
  }
`;

const RecentMessageButton = ({ visible, onClick, text, fullScreen }) => {
  const [clicked, setClicked] = useState(false);

  return (
    // <Box >
    <Button
      css={[
        buttonStyle,
        !visible && 'not',
        clicked && 'clicked',
        fullScreen && { position: 'relative' }
      ]}
      primary
      onClick={() => {
        onClick();
        setClicked(true);
      }}
      style={{
        cursor: 'pointer',
        // display: 'inline-block',
        padding: '0',
        // backgroundColor: 'transparent',
        borderRadius: '20px'
      }}
    >
      {text}
      <Icon name="arrow-down" size={16} />
    </Button>
    // </Box>
  );
};

export default RecentMessageButton;
