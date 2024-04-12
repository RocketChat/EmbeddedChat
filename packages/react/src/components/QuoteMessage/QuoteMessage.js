import React, { useContext } from 'react';
import { css } from '@emotion/react';
import { Box } from '../Box';
import useComponentOverrides from '../../theme/useComponentOverrides';
import RCContext from '../../context/RCInstance';
import { Avatar } from '../Avatar';

const QuoteMessageContainerCss = css`
  font-size: 1rem;
  background-color: #ebeff5;
  padding: 0.5rem;
  z-index: 100;
  justify-content: space-between;
  border: 0.5px solid currentColor;
  border-radius: 0.15rem;
`;

const AvatarContainerCss = css`
  padding: 0.25rem;
  display: flex;
  gap: 0.5rem;
`;

const MessageCss = css`
  padding: 0.25rem;
`;

const QuoteMessage = ({ className = '', style = {}, message }) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };
  const { classNames, styleOverrides } = useComponentOverrides('QuoteMessage');
  return (
    <Box
      className={`ec-quote-msg ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      css={QuoteMessageContainerCss}
    >
      <Box css={AvatarContainerCss}>
        <Avatar
          url={getUserAvatarUrl(message?.u.username)}
          alt="avatar"
          size="1.5em"
        />
        <Box>{message?.u.username}</Box>
      </Box>
      <Box css={MessageCss}>{message.msg}</Box>
    </Box>
  );
};

export default QuoteMessage;
