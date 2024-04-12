import React, { useContext } from 'react';
import { css } from '@emotion/react';
import { Box } from '../Box';
import useComponentOverrides from '../../theme/useComponentOverrides';
import RCContext from '../../context/RCInstance';
import { Avatar } from '../Avatar';
import { ActionButton } from '../ActionButton';
import { Icon } from '../Icon';
import { useMessageStore } from '../../store';

const QuoteMessageContainerCss = css`
  position: relative;
  font-size: 1rem;
  background-color: #ebeff5;
  padding: 0.5rem;
  z-index: 100;
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

const ActionButtonCss = css`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
`;

const QuoteMessage = ({ className = '', style = {}, message }) => {
  const { RCInstance } = useContext(RCContext);
  const getUserAvatarUrl = (username) => {
    const host = RCInstance.getHost();
    const URL = `${host}/avatar/${username}`;
    return URL;
  };
  const setQuoteMessage = useMessageStore((state) => state.setQuoteMessage);

  const { classNames, styleOverrides } = useComponentOverrides('QuoteMessage');
  return (
    <Box
      className={`ec-quote-msg ${className} ${classNames}`}
      style={{ ...styleOverrides, ...style }}
      css={QuoteMessageContainerCss}
    >
      <Box css={ActionButtonCss}>
        <ActionButton ghost onClick={() => setQuoteMessage({})} size="0.75rem">
          <Icon name="cross" size="0.75rem" />
        </ActionButton>
      </Box>
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
