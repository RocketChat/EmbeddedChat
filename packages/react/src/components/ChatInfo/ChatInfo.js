import React from 'react';
import { css } from '@emotion/react';
import { Box } from '../Box';
import { Icon } from '../Icon';
import useComponentOverrides from '../../theme/useComponentOverrides';

const ChatInfoContainerCss = css`
  font-size: 0.75rem;
  padding: 0 0.25rem;
  z-index: 100;
  display: flex;
  justify-content: space-between;
`;

const ChatInfoMessageCss = css`
  background-color: #cbced1;
  padding: 0 0.25rem;
  display: flex;
  gap: 0.1rem;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  color: #2f343d;
`;
const ChatInfo = ({
  className = '',
  style = {},
  status,
  iconName,
  instructions,
}) => {
  const { classNames, styleOverrides } = useComponentOverrides('ChatInfo');
  return (
    <Box
      className={`ec-chat-info ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      css={ChatInfoContainerCss}
    >
      <Box css={ChatInfoMessageCss}>
        {iconName && <Icon name={iconName} size="10" />}
        <span>{status}</span>
      </Box>
      <Box>
        <span>{instructions}</span>
      </Box>
    </Box>
  );
};

export default ChatInfo;
